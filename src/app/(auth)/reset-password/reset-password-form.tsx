"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { updatePassword } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Nouveau mot de passe</CardTitle>
        <CardDescription>Choisis un nouveau mot de passe pour ton compte.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(state && !state.success && state.fieldErrors?.password)}
              required
            />
            {state && !state.success && state.fieldErrors?.password && (
              <p className="text-destructive text-sm">{state.fieldErrors.password[0]}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(state && !state.success && state.fieldErrors?.confirmPassword)}
              required
            />
            {state && !state.success && state.fieldErrors?.confirmPassword && (
              <p className="text-destructive text-sm">{state.fieldErrors.confirmPassword[0]}</p>
            )}
          </div>

          {state && !state.success && !state.fieldErrors && (
            <p role="alert" className="text-destructive text-sm">
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="animate-spin" />}
            Mettre à jour le mot de passe
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
