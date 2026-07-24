"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { signInWithGoogle, signUpWithPassword } from "@/app/(auth)/actions";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export function SignUpForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [state, formAction, isPending] = useActionState(signUpWithPassword, null);
  const signInWithGoogleForRedirect = signInWithGoogle.bind(null, "/onboarding");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Créer un compte</CardTitle>
        <CardDescription>
          40 crédits offerts pour créer ton premier personnage et ton premier épisode.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
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
          <div className="grid gap-2">
            <Label htmlFor="fullName">Nom</Label>
            <Input
              id="fullName"
              name="fullName"
              autoComplete="name"
              placeholder="Ton nom"
              aria-invalid={Boolean(state && !state.success && state.fieldErrors?.fullName)}
              required
            />
            {state && !state.success && state.fieldErrors?.fullName && (
              <p className="text-destructive text-sm">{state.fieldErrors.fullName[0]}</p>
            )}
          </div>
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
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(state && !state.success && state.fieldErrors?.password)}
              aria-describedby="password-hint"
              required
            />
            <p id="password-hint" className="text-muted-foreground text-xs">
              8 caractères minimum, avec majuscule, minuscule et chiffre.
            </p>
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
            Créer mon compte
          </Button>

          <p className="text-muted-foreground text-center text-xs">
            En créant un compte, tu acceptes nos{" "}
            <Link href="/terms" className="hover:text-foreground underline">
              conditions d&apos;utilisation
            </Link>{" "}
            et notre{" "}
            <Link href="/privacy" className="hover:text-foreground underline">
              politique de confidentialité
            </Link>
            .
          </p>
        </form>

        <p className="text-muted-foreground text-center text-sm">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-foreground font-medium hover:underline">
            Se connecter
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
