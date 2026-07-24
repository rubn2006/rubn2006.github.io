import "server-only";
import { redirect } from "next/navigation";

import type { Tables } from "@/types/database";
import { createClient } from "@/lib/supabase/server";

export interface CurrentUserContext {
  userId: string;
  email: string;
  profile: Tables<"profiles">;
  wallet: Tables<"credit_wallets">;
  subscription: Tables<"subscriptions"> | null;
  preferences: Tables<"user_preferences"> | null;
}

/** Returns null when signed out. Fetches everything the app shell needs in one place. */
export async function getCurrentUserContext(): Promise<CurrentUserContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profileRes, walletRes, subscriptionRes, preferencesRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("credit_wallets").select("*").eq("user_id", user.id).single(),
    supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  // profiles/credit_wallets are created synchronously by the handle_new_user
  // trigger at signup, so a miss here means something is actually wrong
  // rather than "still provisioning" — surface it instead of a confusing UI.
  if (profileRes.error || !profileRes.data) {
    throw new Error("Profil introuvable pour l'utilisateur connecté.");
  }
  if (walletRes.error || !walletRes.data) {
    throw new Error("Portefeuille de crédits introuvable pour l'utilisateur connecté.");
  }

  return {
    userId: user.id,
    email: user.email ?? profileRes.data.email,
    profile: profileRes.data,
    wallet: walletRes.data,
    subscription: subscriptionRes.data ?? null,
    preferences: preferencesRes.data ?? null,
  };
}

export async function requireCurrentUserContext(): Promise<CurrentUserContext> {
  const ctx = await getCurrentUserContext();
  if (!ctx) redirect("/login");
  return ctx;
}
