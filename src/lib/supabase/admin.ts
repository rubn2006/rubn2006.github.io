import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/types/database";
import { env } from "@/lib/env.server";

/**
 * Service-role client: bypasses RLS entirely. Reserved for trusted,
 * privileged server code only — Stripe webhooks, the credit engine, job
 * workers, admin routes. Never expose this client (or a route that uses it
 * without its own authorization check) to arbitrary user input.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
