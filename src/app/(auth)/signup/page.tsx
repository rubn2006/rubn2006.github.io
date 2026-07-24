import type { Metadata } from "next";

import { isGoogleOAuthEnabled } from "@/lib/env.server";

import { SignUpForm } from "./signup-form";

export const metadata: Metadata = {
  title: "Créer un compte",
};

export default function SignUpPage() {
  return <SignUpForm googleEnabled={isGoogleOAuthEnabled} />;
}
