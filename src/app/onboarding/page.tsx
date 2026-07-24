import type { Metadata } from "next";

import { requireCurrentUserContext } from "@/lib/auth/current-user";

import { OnboardingForm } from "./onboarding-form";

export const metadata: Metadata = {
  title: "Bienvenue",
};

export default async function OnboardingPage() {
  await requireCurrentUserContext();

  return (
    <div className="bg-muted/40 flex min-h-svh items-center justify-center px-4 py-12">
      <OnboardingForm />
    </div>
  );
}
