import type { Metadata } from "next";

import { isGoogleOAuthEnabled } from "@/lib/env.server";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Connexion",
};

const ERROR_MESSAGES: Record<string, string> = {
  auth_callback_failed: "Le lien a expiré ou a déjà été utilisé. Merci de réessayer.",
  google_oauth_unavailable: "La connexion Google est momentanément indisponible.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? "Une erreur est survenue.") : undefined;

  return <LoginForm next={next} googleEnabled={isGoogleOAuthEnabled} initialError={errorMessage} />;
}
