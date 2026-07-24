import type { Metadata } from "next";

import { PageHeader } from "@/components/app-shell/page-header";
import { DangerZone } from "@/components/settings/danger-zone";
import { ProfileForm } from "@/components/settings/profile-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireCurrentUserContext } from "@/lib/auth/current-user";

export const metadata: Metadata = {
  title: "Paramètres du compte",
};

export default async function SettingsPage() {
  const ctx = await requireCurrentUserContext();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Paramètres du compte" />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm fullName={ctx.profile.full_name} email={ctx.email} />
        </CardContent>
      </Card>

      <DangerZone />
    </div>
  );
}
