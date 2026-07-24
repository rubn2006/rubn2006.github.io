"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { completeOnboarding } from "@/app/onboarding/actions";
import { ChoiceGroup } from "@/components/onboarding/choice-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CONTENT_TYPES,
  EXPERIENCE_LEVELS,
  PLATFORMS,
  PROFILE_KINDS,
  VISUAL_STYLES,
} from "@/lib/config/site";

export function OnboardingForm() {
  const [state, formAction, isPending] = useActionState(completeOnboarding, null);

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Bienvenue sur FruitDrama Studio</CardTitle>
        <CardDescription>
          Quelques questions rapides pour personnaliser ton tableau de bord. Tu peux tout modifier
          plus tard, ou passer cette étape.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-8">
          <div className="grid gap-3">
            <Label>Tu es plutôt...</Label>
            <ChoiceGroup name="profile_kind" options={PROFILE_KINDS} />
          </div>

          <div className="grid gap-3">
            <Label>Quel type de contenu veux-tu créer ?</Label>
            <ChoiceGroup
              name="content_type"
              options={CONTENT_TYPES.map((label) => ({ id: label, label }))}
            />
          </div>

          <div className="grid gap-3">
            <Label>Plateforme principale</Label>
            <ChoiceGroup name="main_platform" options={PLATFORMS} />
          </div>

          <div className="grid gap-3">
            <Label>Ton expérience en création vidéo</Label>
            <ChoiceGroup name="experience_level" options={EXPERIENCE_LEVELS} />
          </div>

          <div className="grid gap-3">
            <Label>Style visuel préféré</Label>
            <ChoiceGroup
              name="preferred_style"
              options={VISUAL_STYLES.map((label) => ({ id: label, label }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="monthly_goal">Ton objectif mensuel (optionnel)</Label>
            <Input
              id="monthly_goal"
              name="monthly_goal"
              placeholder="Ex : publier 8 épisodes par mois"
            />
          </div>

          {state && !state.success && (
            <p role="alert" className="text-destructive text-sm">
              {state.error}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="submit"
              name="intent"
              value="skip"
              variant="ghost"
              disabled={isPending}
              formNoValidate
            >
              Passer cette étape
            </Button>
            <Button type="submit" name="intent" value="complete" disabled={isPending}>
              {isPending && <Loader2 className="animate-spin" />}
              Continuer
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
