import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "@/types/database";
import { env } from "@/lib/env.server";

/**
 * RLS-scoped Supabase client for Server Components, Server Actions and Route
 * Handlers. Runs as the signed-in user (or anon), never bypasses RLS.
 *
 * Calling `.setAll` from a Server Component (not a Server Action/Route
 * Handler) throws — Next.js forbids setting cookies outside a mutation
 * context. We swallow that specific case because `updateSession` in
 * middleware.ts already refreshes the session cookie on every request.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component render; middleware handles refresh.
          }
        },
      },
    },
  );
}
