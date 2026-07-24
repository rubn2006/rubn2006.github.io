import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_STARTER: z.string().optional(),
  STRIPE_PRICE_CREATOR: z.string().optional(),
  STRIPE_PRICE_PRO: z.string().optional(),
  STRIPE_PRICE_CREDITS_SMALL: z.string().optional(),
  STRIPE_PRICE_CREDITS_MEDIUM: z.string().optional(),
  STRIPE_PRICE_CREDITS_LARGE: z.string().optional(),

  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),

  VIDEO_PROVIDER: z.string().default("mock"),
  VIDEO_PROVIDER_API_KEY: z.string().optional(),
  VOICE_PROVIDER: z.string().default("mock"),
  ELEVENLABS_API_KEY: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
  REDIS_URL: z.string().optional(),

  MOCK_AI_PROVIDERS: z
    .string()
    .optional()
    .transform((v) => v !== "false"),

  ADMIN_EMAILS: z
    .string()
    .optional()
    .default("")
    .transform((v) =>
      v
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    ),

  POSTHOG_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().optional(),

  GOOGLE_OAUTH_CLIENT_ID: z.string().optional(),
  GOOGLE_OAUTH_CLIENT_SECRET: z.string().optional(),
});

function loadServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // Field names only — never log values, some of these are secrets.
    console.error(
      "Invalid environment variables:",
      Object.keys(parsed.error.flatten().fieldErrors),
    );
    throw new Error(
      "Invalid or missing environment variables. Copy .env.example to .env.local and fill in the required values.",
    );
  }
  return parsed.data;
}

export const env = loadServerEnv();

/** True unless MOCK_AI_PROVIDERS is explicitly "false". Safe, dependency-free default for local dev and CI. */
export const isMockMode = env.MOCK_AI_PROVIDERS;
export const isGoogleOAuthEnabled = Boolean(
  env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET,
);
export const isStripeEnabled = Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET);
export const isResendEnabled = Boolean(env.RESEND_API_KEY);

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return env.ADMIN_EMAILS.includes(email.toLowerCase());
}
