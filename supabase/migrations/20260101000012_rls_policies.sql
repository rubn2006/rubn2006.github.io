-- ============================================================================
-- Row Level Security
--
-- Pattern: every user-owned table carries a (possibly denormalized) user_id
-- column and gets a simple `auth.uid() = user_id` policy. Tables that back
-- money or generation-truth (subscriptions, credit_wallets, credit_transactions,
-- generation_jobs, scene_generations, audio_generations, video_renders) are
-- SELECT-only for authenticated users: all writes to those happen exclusively
-- through trusted server code using the service-role client (webhooks, the
-- credit engine, job workers), never directly from the browser.
--
-- provider_costs / webhook_events / audit_logs have RLS enabled with zero
-- policies for anon/authenticated, so only the service role (which bypasses
-- RLS entirely in Supabase) can touch them.
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.credit_wallets enable row level security;
alter table public.credit_transactions enable row level security;
alter table public.subscriptions enable row level security;
alter table public.projects enable row level security;
alter table public.series enable row level security;
alter table public.characters enable row level security;
alter table public.character_reference_images enable row level security;
alter table public.episodes enable row level security;
alter table public.storyboards enable row level security;
alter table public.scenes enable row level security;
alter table public.generation_jobs enable row level security;
alter table public.scene_generations enable row level security;
alter table public.audio_generations enable row level security;
alter table public.video_renders enable row level security;
alter table public.assets enable row level security;
alter table public.provider_costs enable row level security;
alter table public.webhook_events enable row level security;
alter table public.audit_logs enable row level security;

-- profiles ---------------------------------------------------------------
create policy "profiles_select_own" on public.profiles for select
  using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);
-- Column-level grants restricting this to (full_name, avatar_url) only live in
-- 20260101000014_grants.sql, alongside every other Data API grant.

-- user_preferences ---------------------------------------------------------
create policy "user_preferences_select_own" on public.user_preferences for select
  using (auth.uid() = user_id);
create policy "user_preferences_update_own" on public.user_preferences for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- credit_wallets: read-only, the credit engine (service role) is the only writer
create policy "credit_wallets_select_own" on public.credit_wallets for select
  using (auth.uid() = user_id);

-- credit_transactions: read-only ledger
create policy "credit_transactions_select_own" on public.credit_transactions for select
  using (auth.uid() = user_id);

-- subscriptions: read-only, Stripe webhooks (service role) are the only writer
create policy "subscriptions_select_own" on public.subscriptions for select
  using (auth.uid() = user_id);

-- projects -------------------------------------------------------------------
create policy "projects_select_own" on public.projects for select
  using (auth.uid() = user_id);
create policy "projects_insert_own" on public.projects for insert
  with check (auth.uid() = user_id);
create policy "projects_update_own" on public.projects for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "projects_delete_own" on public.projects for delete
  using (auth.uid() = user_id);

-- series -----------------------------------------------------------------
create policy "series_select_own" on public.series for select
  using (auth.uid() = user_id);
create policy "series_insert_own" on public.series for insert
  with check (auth.uid() = user_id);
create policy "series_update_own" on public.series for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "series_delete_own" on public.series for delete
  using (auth.uid() = user_id);

-- characters ---------------------------------------------------------------
create policy "characters_select_own" on public.characters for select
  using (auth.uid() = user_id);
create policy "characters_insert_own" on public.characters for insert
  with check (auth.uid() = user_id);
create policy "characters_update_own" on public.characters for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "characters_delete_own" on public.characters for delete
  using (auth.uid() = user_id);

-- character_reference_images ------------------------------------------------
create policy "character_reference_images_select_own" on public.character_reference_images for select
  using (auth.uid() = user_id);
create policy "character_reference_images_insert_own" on public.character_reference_images for insert
  with check (auth.uid() = user_id);
create policy "character_reference_images_update_own" on public.character_reference_images for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "character_reference_images_delete_own" on public.character_reference_images for delete
  using (auth.uid() = user_id);

-- episodes -------------------------------------------------------------------
create policy "episodes_select_own" on public.episodes for select
  using (auth.uid() = user_id);
create policy "episodes_insert_own" on public.episodes for insert
  with check (auth.uid() = user_id);
create policy "episodes_update_own" on public.episodes for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "episodes_delete_own" on public.episodes for delete
  using (auth.uid() = user_id);

-- storyboards ------------------------------------------------------------
create policy "storyboards_select_own" on public.storyboards for select
  using (auth.uid() = user_id);
create policy "storyboards_insert_own" on public.storyboards for insert
  with check (auth.uid() = user_id);
create policy "storyboards_update_own" on public.storyboards for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "storyboards_delete_own" on public.storyboards for delete
  using (auth.uid() = user_id);

-- scenes -------------------------------------------------------------------
create policy "scenes_select_own" on public.scenes for select
  using (auth.uid() = user_id);
create policy "scenes_insert_own" on public.scenes for insert
  with check (auth.uid() = user_id);
create policy "scenes_update_own" on public.scenes for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "scenes_delete_own" on public.scenes for delete
  using (auth.uid() = user_id);

-- generation_jobs / scene_generations / audio_generations / video_renders:
-- progress is visible to the owner, writes are server-side only.
create policy "generation_jobs_select_own" on public.generation_jobs for select
  using (auth.uid() = user_id);
create policy "scene_generations_select_own" on public.scene_generations for select
  using (auth.uid() = user_id);
create policy "audio_generations_select_own" on public.audio_generations for select
  using (auth.uid() = user_id);
create policy "video_renders_select_own" on public.video_renders for select
  using (auth.uid() = user_id);

-- assets: users can list/upload/delete their own, updates go through the app
create policy "assets_select_own" on public.assets for select
  using (auth.uid() = user_id);
create policy "assets_insert_own" on public.assets for insert
  with check (auth.uid() = user_id);
create policy "assets_delete_own" on public.assets for delete
  using (auth.uid() = user_id);

-- provider_costs / webhook_events / audit_logs intentionally have no
-- authenticated/anon policies: RLS is enabled above with no grants, so
-- only the service role (which bypasses RLS in Supabase) can read/write them.
