"use server";

import { redirect } from "next/navigation";

import {
  actionError,
  actionErrorFromUnknown,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import { publicEnv } from "@/lib/env.public";
import { createClient } from "@/lib/supabase/server";
import {
  forgotPasswordSchema,
  magicLinkSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validations/auth";

function friendlyAuthError(message: string): string {
  const known: Record<string, string> = {
    "Invalid login credentials": "Email ou mot de passe incorrect.",
    "Email not confirmed": "Merci de confirmer ton adresse email avant de te connecter.",
    "User already registered": "Un compte existe déjà avec cette adresse email.",
    "Password should be at least 6 characters": "Le mot de passe est trop court.",
    "Signup requires a valid password": "Le mot de passe fourni n'est pas valide.",
    "For security purposes, you can only request this after some time.":
      "Merci de patienter quelques instants avant de réessayer.",
  };
  return known[message] ?? "Une erreur est survenue. Merci de réessayer.";
}

function fieldErrorsFromZod(error: {
  flatten: () => { fieldErrors: Record<string, string[] | undefined> };
}) {
  const flat = error.flatten().fieldErrors;
  const out: Record<string, string[]> = {};
  for (const [key, value] of Object.entries(flat)) {
    if (value) out[key] = value;
  }
  return out;
}

export async function signUpWithPassword(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return actionError("Merci de corriger les champs indiqués.", fieldErrorsFromZod(parsed.error));
  }

  let destination: string;
  try {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        data: { full_name: parsed.data.fullName },
        emailRedirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback?next=/onboarding`,
      },
    });
    if (error) return actionError(friendlyAuthError(error.message));
    // Email confirmation required before a session exists.
    destination = data.session ? "/onboarding" : "/check-email";
  } catch (err) {
    return actionErrorFromUnknown("signUpWithPassword", err);
  }

  redirect(destination);
}

export async function signInWithPassword(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return actionError("Merci de corriger les champs indiqués.", fieldErrorsFromZod(parsed.error));
  }

  const next = formData.get("next");
  const redirectTo = typeof next === "string" && next.startsWith("/") ? next : "/dashboard";

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) return actionError(friendlyAuthError(error.message));
  } catch (err) {
    return actionErrorFromUnknown("signInWithPassword", err);
  }

  redirect(redirectTo);
}

export async function signInWithMagicLink(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = magicLinkSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return actionError("Merci de corriger les champs indiqués.", fieldErrorsFromZod(parsed.error));
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data.email,
      options: {
        emailRedirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback?next=/dashboard`,
        shouldCreateUser: true,
      },
    });
    if (error) return actionError(friendlyAuthError(error.message));
  } catch (err) {
    return actionErrorFromUnknown("signInWithMagicLink", err);
  }

  redirect("/check-email");
}

export async function signInWithGoogle(next?: string) {
  const supabase = await createClient();
  const redirectTo = `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback${
    next ? `?next=${encodeURIComponent(next)}` : ""
  }`;
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error || !data.url) {
    redirect("/login?error=google_oauth_unavailable");
  }
  redirect(data.url);
}

export async function requestPasswordReset(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) {
    return actionError("Merci de corriger les champs indiqués.", fieldErrorsFromZod(parsed.error));
  }

  try {
    const supabase = await createClient();
    // Always return success even if the email doesn't exist, to avoid
    // leaking which addresses have an account.
    await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${publicEnv.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
    });
  } catch (err) {
    return actionErrorFromUnknown("requestPasswordReset", err);
  }

  return actionSuccess(undefined);
}

export async function updatePassword(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return actionError("Merci de corriger les champs indiqués.", fieldErrorsFromZod(parsed.error));
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return actionError("Ta session a expiré. Merci de redemander un lien de réinitialisation.");
    }
    const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
    if (error) return actionError(friendlyAuthError(error.message));
  } catch (err) {
    return actionErrorFromUnknown("updatePassword", err);
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
