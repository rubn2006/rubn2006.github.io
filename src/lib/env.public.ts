import { z } from "zod";

const publicEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

// Each NEXT_PUBLIC_* var must be a static `process.env.X` access (not spread
// or dynamic) so Next.js can inline it into the client bundle at build time.
const parsed = publicEnvSchema.safeParse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
});

if (!parsed.success) {
  throw new Error(
    `Invalid public environment variables: ${JSON.stringify(parsed.error.flatten().fieldErrors)}. Copy .env.example to .env.local and fill in the Supabase values.`,
  );
}

export const publicEnv = parsed.data;
