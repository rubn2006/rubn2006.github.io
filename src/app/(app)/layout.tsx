import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell/app-shell";
import { requireCurrentUserContext } from "@/lib/auth/current-user";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const ctx = await requireCurrentUserContext();

  if (!ctx.profile.onboarding_completed_at) {
    redirect("/onboarding");
  }

  return (
    <AppShell
      fullName={ctx.profile.full_name}
      email={ctx.email}
      avatarUrl={ctx.profile.avatar_url}
      creditBalance={ctx.wallet.balance}
      plan={ctx.subscription?.plan ?? "free"}
    >
      {children}
    </AppShell>
  );
}
