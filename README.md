# FruitDrama Studio

Turn a one-line idea into a vertical short video, with recurring characters that stay visually
and behaviourally consistent across episodes. Built with Next.js (App Router) + Supabase +
Stripe, with a full **MOCK mode** so the entire product can be exercised without spending on any
AI provider.

> This repository's name (`rubn2006.github.io`) comes from its GitHub Pages origins, but the app
> itself is a full Next.js server application — it does **not** deploy to GitHub Pages (see
> [Deployment](#deployment)). It deploys to Vercel + Supabase like any other Next.js/Supabase app.

## Current status: Phase 1 of 5

This build follows the phased plan below. **Phase 1 is complete**: project scaffold, design
system, authentication, full database schema, dashboard, projects, and characters (including the
character-consistency prompt engine) are real and functional end to end against a real Supabase
project. Phases 2–5 (generation wizard, mock/real AI providers, FFmpeg rendering, Stripe, admin,
analytics, emails) are not built yet — see [Roadmap](#roadmap).

**What you can actually do right now:**

- Sign up (email/password, magic link, or Google OAuth if configured) and receive 40 free credits
- Complete (or skip) onboarding
- Create/archive/delete projects (series or standalone ad)
- Create characters with a full consistency sheet (appearance, colors, accessories, personality,
  voice, locked visual prompt, negative prompt) and upload a reference image
- View the exact `buildCharacterConsistencyPrompt()` output that a future generation pipeline
  would inject into every scene for that character
- See your credit ledger and current plan on the billing page (Stripe checkout itself is Phase 4)
- Update your profile and delete your account

**What's intentionally not wired up yet** (and says so honestly in the UI rather than faking it):
episode/script generation, storyboard, scene rendering, FFmpeg assembly, subtitles, real Stripe
checkout, admin panel, analytics events, transactional emails.

## Architecture

```
Next.js App Router (Vercel)  ──┬──  Supabase Postgres (RLS everywhere)
                                ├──  Supabase Auth (email/password, magic link, Google OAuth)
                                ├──  Supabase Storage (7 private-by-default buckets)
                                └──  Stripe (Phase 4)

Background rendering / AI generation (Phase 2+) ──  separate worker (Railway/Render/Fly.io/
                                                      Trigger.dev) — never a short-lived
                                                      serverless function. FFmpeg and multi-minute
                                                      generations do not belong in `next build`'s
                                                      request/response cycle.
```

Key decisions and why:

- **`@supabase/ssr` session-scoped client everywhere by default.** Server Actions and Server
  Components run as the signed-in user via `src/lib/supabase/server.ts`, so Postgres RLS is the
  real enforcement boundary, not just a client-side check. The service-role client
  (`src/lib/supabase/admin.ts`) is reserved for a short, explicit list of privileged operations
  (account deletion via the Auth Admin API, future Stripe webhooks) and always re-derives the
  target user from the caller's own session first.
- **Denormalized `user_id` on every child table.** `scenes`, `assets`, `character_reference_images`,
  etc. all carry `user_id` directly (not just via a join), so every RLS policy is a flat
  `auth.uid() = user_id` check — simple to audit, cheap to evaluate.
- **Explicit Data API grants.** Recent Supabase projects no longer auto-expose new tables to
  `anon`/`authenticated`/`service_role` — see
  `supabase/migrations/20260101000014_grants.sql`. RLS narrows rows within whatever a grant
  allows; without the grant, RLS is irrelevant because PostgREST returns permission denied first.
  This file also restricts `profiles` to column-level grants so a user can update their own
  `full_name`/`avatar_url`/`onboarding_completed_at` but can never self-promote `role` to `admin`
  or rewrite `stripe_customer_id`, even via a direct PostgREST call.
- **Immutable credit ledger.** `credit_transactions` is insert-only (`UPDATE`/`DELETE` revoked for
  `authenticated`/`anon`); `credit_wallets.balance` is a cache, never the source of truth. The
  reservation → debit-on-success → auto-refund-on-failure flow described in the product spec is
  designed into the schema now (`generation_jobs.credits_reserved`/`credits_debited`,
  `credit_transactions.idempotency_key`) but the actual reservation engine ships in Phase 4
  alongside Stripe.
- **One config file per concern.** `src/lib/config/pricing.ts` is the single source of truth for
  plans, credit packs and credit costs (spec requirement: change a price in one place). `site.ts`
  holds non-monetary site metadata.
- **`buildCharacterConsistencyPrompt()`** (`src/lib/characters/consistency-prompt.ts`) is the one
  place that turns a character row into a reusable prompt block. Every future scene/episode
  generator must call this instead of hand-building character descriptions — that's the whole
  point of the product.

### Provider abstraction (designed now, implemented Phase 3)

The spec calls for `TextGenerationProvider` / `ImageGenerationProvider` /
`VideoGenerationProvider` / `VoiceGenerationProvider` / `MusicGenerationProvider` /
`ModerationProvider` interfaces with swappable adapters and a full MOCK implementation. The
credit-cost model, provider selection env vars (`VIDEO_PROVIDER`, `VOICE_PROVIDER`), the mock
voice catalog (`src/lib/config/voices.ts`), and `MOCK_AI_PROVIDERS` env parsing
(`src/lib/env.server.ts`) already exist so Phase 3 slots providers in without touching the data
model. Nothing calls a real AI provider yet.

## Tech stack

- Next.js 15 (App Router), React 19, TypeScript strict (`noUncheckedIndexedAccess`, no `any`)
- Tailwind CSS v4 + hand-built shadcn/ui-style components (Radix primitives, no reliance on the
  shadcn CLI/registry network call)
- Supabase (Postgres, Auth, Storage) via `@supabase/ssr`
- Zod validation on every Server Action input
- Vitest for unit tests, Playwright installed for future E2E (Phase 5)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

**Option A — local Supabase (requires Docker):**

```bash
npx supabase start      # boots Postgres/Auth/Storage/Studio locally
npx supabase db reset   # applies every migration in supabase/migrations + supabase/seed.sql
```

`supabase start` prints your local `API URL`, `anon key` and `service_role key` — copy those into
`.env.local` (see below).

**Option B — hosted Supabase project:**

1. Create a project at [supabase.com](https://supabase.com).
2. Run every file in `supabase/migrations/` **in filename order** via the SQL editor, or link the
   project and run `npx supabase db push`.
3. Copy `Project Settings > API` values into `.env.local`.
4. Optionally run `supabase/seed.sql` for the reference `provider_costs` rows (safe on hosted too
   — it's plain reference data, no auth dependency).

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in at minimum `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`. Everything else (Stripe, AI providers, Resend, PostHog, Google OAuth)
is optional — the app runs fully in MOCK mode without them. See `.env.example` for the full list
and which phase each group belongs to.

### 4. Run the app

```bash
npm run dev
```

Visit `http://localhost:3000`. Sign up, and the `handle_new_user` Postgres trigger grants 40
credits, a free-plan subscription row, and an empty preferences row automatically.

### Seeding a demo character

There's no fabricated "demo account" in `supabase/seed.sql` on purpose — hand-crafting a working
`auth.users` row outside Supabase's own signup flow is version-fragile and risks silently breaking
`db reset` for everyone. Instead: sign up for real (mock or local Supabase both work), then create
a character named **Ruby** (fruit, red/green, curious personality) through the UI at
`/characters/new` — that exercises the exact flow described in the product brief.

## Scripts

| Command                           | What it does                                                           |
| --------------------------------- | ---------------------------------------------------------------------- |
| `npm run dev`                     | Start the dev server                                                   |
| `npm run build`                   | Production build                                                       |
| `npm run lint` / `lint:fix`       | ESLint (flat config)                                                   |
| `npm run typecheck`               | `tsc --noEmit`                                                         |
| `npm run format` / `format:check` | Prettier                                                               |
| `npm test`                        | Vitest unit tests                                                      |
| `npm run test:e2e`                | Playwright (installed, suite not written until Phase 5)                |
| `npm run db:types`                | Regenerate `src/types/database.ts` from a running local Supabase stack |

## Database

All schema lives in `supabase/migrations/`, applied in filename order:

1. `0001` extensions & enums
2. `0002`–`0010` tables, in dependency order (profiles → subscriptions/wallets → projects/series →
   characters → episodes/storyboards/scenes → generation_jobs → assets/generations/renders →
   credit_transactions → provider_costs/webhook_events/audit_logs)
3. `0011` shared `updated_at` trigger + `handle_new_user()` (signup bootstrap)
4. `0012` RLS policies
5. `0013` storage buckets + storage policies
6. `0014` Data API grants (see [Architecture](#architecture) above — required, not optional, on
   recent Supabase projects)

Every migration was verified by actually running it against a real Postgres 16 instance (with a
minimal `auth`/`storage` schema stub standing in for the platform) — including a functional pass
confirming cross-user reads/writes are denied, column-level grants block role self-escalation, and
`service_role` correctly bypasses RLS. This isn't just a schema written and hoped-for; it runs.

**Tables:** `profiles`, `user_preferences`, `subscriptions`, `credit_wallets`,
`credit_transactions`, `projects`, `series`, `characters`, `character_reference_images`,
`episodes`, `storyboards`, `scenes`, `generation_jobs`, `scene_generations`, `audio_generations`,
`video_renders`, `assets`, `provider_costs`, `webhook_events`, `audit_logs` — all 20 tables from
the product spec exist now, even though only `profiles` through `characters` have UI/business
logic wired up in Phase 1. This avoids retrofitting RLS and foreign keys onto a live schema later.

**Storage buckets:** `avatars` (public), `character-references`, `generated-images`,
`generated-clips`, `generated-audio`, `final-videos`, `thumbnails` (all private, folder-scoped to
`{bucket}/{user_id}/...`, served via signed URLs — see `src/lib/storage/upload.ts`).

## Known issue you should not "fix" by upgrading

`package.json` pins `@radix-ui/react-slot` to `1.2.5` (both as a direct dependency and via
`overrides`, so every Radix package that depends on it transitively gets the same version).
**This is required, not a leftover.** `@radix-ui/react-slot@1.3.x` calls `React.createContext()`
at module load time in a way that throws `TypeError: d.createContext is not a function` during
Next.js 15.5.21's "Collecting page data" build step — reproduced in complete isolation against a
throwaway Next app, confirmed to be the `react-slot` version and not React 19, Next's config, or
any other dependency. Bumping past `1.2.5` will break `next build` again until upstream fixes it.

## Security notes

- Every user-data table has RLS; service-role access is narrow and explicit (see Architecture).
- All Server Action inputs are Zod-validated; errors returned to the client are always
  human-readable and generic — raw errors are `console.error`'d server-side only
  (`src/lib/action-result.ts`).
- Uploaded filenames are never trusted: `src/lib/storage/upload.ts` generates a fresh UUID-based
  path and validates MIME type + size against `src/lib/config/storage.ts` before upload.
- No secret ever ships to the browser: `src/lib/env.server.ts` (secrets, `import "server-only"`)
  is strictly separate from `src/lib/env.public.ts` (only `NEXT_PUBLIC_*`).
- The character form requires confirming rights over any uploaded reference image, per the
  product's anti-deepfake/anti-impersonation policy.
- Legal pages (`/terms`, `/privacy`, `/refund-policy`) are functional, real-structure drafts
  clearly marked in-page as templates pending legal review — not fabricated as final.

## Deployment

- **Frontend/API:** Vercel (or any Next.js-compatible host). Do not deploy to GitHub Pages —
  it's static-only and cannot run Server Actions, Route Handlers, or middleware.
- **Database/Auth/Storage:** Supabase (hosted).
- **Payments:** Stripe (Phase 4).
- **Rendering workers (Phase 3+):** a long-running environment (Railway, Render, Fly.io, or
  Trigger.dev) — FFmpeg and multi-minute AI generation jobs must not run inside a short-lived
  serverless function. This is designed for from the start (`generation_jobs` table, job-per-step
  tracing) even though the worker itself doesn't exist yet.

## Roadmap

- **Phase 2:** creation wizard, mock script/storyboard generation, job queue, generation
  progress UI.
- **Phase 3:** real provider adapters behind the abstract interfaces (text/image/video/voice),
  mock and real image/video generation, FFmpeg rendering, download.
- **Phase 4:** Stripe checkout/portal/webhooks, the credit reservation-and-refund engine, plan
  enforcement.
- **Phase 5:** real provider activation, admin panel, PostHog-compatible analytics, Resend emails,
  full test suite (Playwright E2E, Stripe/webhook tests), security hardening pass, deployment
  docs finalization.

Each phase ends with a clean `lint` + `typecheck` + `test` + `build` and an update to this section.
