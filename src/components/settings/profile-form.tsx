"use client";

import { useActionState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { updateProfile } from "@/app/(app)/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm({ fullName, email }: { fullName: string | null; email: string }) {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  useEffect(() => {
    if (state?.success) toast.success("Profil mis à jour");
    else if (state && !state.success) toast.error(state.error);
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email-readonly">Email</Label>
        <Input id="email-readonly" value={email} disabled readOnly />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="fullName">Nom complet</Label>
        <Input id="fullName" name="fullName" defaultValue={fullName ?? ""} required />
      </div>
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending && <Loader2 className="animate-spin" />}
        Enregistrer
      </Button>
    </form>
  );
}
