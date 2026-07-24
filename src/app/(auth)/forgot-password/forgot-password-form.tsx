"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { requestPasswordReset } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(requestPasswordReset, null);

  if (state?.success) {
    return (
      <Card>
        <CardHeader className="items-center text-center">
          <CheckCircle2 className="text-success size-10" />
          <CardTitle className="text-xl">Vérifie ta boîte mail</CardTitle>
          <CardDescription>
            Si un compte existe avec cette adresse, tu vas recevoir un lien pour réinitialiser ton
            mot de passe.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/login" className="text-foreground text-sm font-medium hover:underline">
            Retour à la connexion
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Mot de passe oublié</CardTitle>
        <CardDescription>On t&apos;envoie un lien de réinitialisation par email.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <form action={formAction} className="flex flex-col gap-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="toi@exemple.com"
              aria-invalid={Boolean(state && !state.success && state.fieldErrors?.email)}
              required
            />
            {state && !state.success && state.fieldErrors?.email && (
              <p className="text-destructive text-sm">{state.fieldErrors.email[0]}</p>
            )}
          </div>

          {state && !state.success && !state.fieldErrors && (
            <p role="alert" className="text-destructive text-sm">
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="animate-spin" />}
            Envoyer le lien
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-sm">
          <Link href="/login" className="text-foreground font-medium hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
