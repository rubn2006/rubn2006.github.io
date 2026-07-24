"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { signInWithGoogle, signInWithPassword } from "@/app/(auth)/actions";
import { GoogleButton } from "@/components/auth/google-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function LoginForm({
  next,
  googleEnabled,
  initialError,
}: {
  next?: string;
  googleEnabled: boolean;
  initialError?: string;
}) {
  const [state, formAction, isPending] = useActionState(signInWithPassword, null);
  const signInWithGoogleForRedirect = signInWithGoogle.bind(null, next);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Connexion</CardTitle>
        <CardDescription>Retrouve tes personnages et tes projets.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        {initialError && (
          <Alert variant="destructive">
            <AlertDescription>{initialError}</AlertDescription>
          </Alert>
        )}
        {googleEnabled && (
          <>
            <GoogleButton action={signInWithGoogleForRedirect} />
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-muted-foreground text-xs">ou</span>
              <Separator className="flex-1" />
            </div>
          </>
        )}

        <form action={formAction} className="flex flex-col gap-4" noValidate>
          {next && <input type="hidden" name="next" value={next} />}
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
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link
                href="/forgot-password"
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(state && !state.success && state.fieldErrors?.password)}
              required
            />
            {state && !state.success && state.fieldErrors?.password && (
              <p className="text-destructive text-sm">{state.fieldErrors.password[0]}</p>
            )}
          </div>

          {state && !state.success && !state.fieldErrors && (
            <p role="alert" className="text-destructive text-sm">
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending && <Loader2 className="animate-spin" />}
            Se connecter
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-sm">
          Pas encore de compte ?{" "}
          <Link href="/signup" className="text-foreground font-medium hover:underline">
            Créer un compte
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
