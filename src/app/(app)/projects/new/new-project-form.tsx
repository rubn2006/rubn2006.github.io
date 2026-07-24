"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";

import { createProject } from "@/app/(app)/projects/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PLATFORMS } from "@/lib/config/site";

export function NewProjectForm() {
  const [state, formAction, isPending] = useActionState(createProject, null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nouveau projet</CardTitle>
        <CardDescription>
          Une série pour des personnages récurrents, ou une vidéo publicitaire indépendante.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-col gap-5" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="type">Type de projet</Label>
            <Select name="type" defaultValue="series">
              <SelectTrigger id="type" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="series">Nouvelle série (personnages récurrents)</SelectItem>
                <SelectItem value="standalone_ad">Vidéo publicitaire indépendante</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Nom du projet</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex : FruitDrama - Saison 1"
              aria-invalid={Boolean(state && !state.success && state.fieldErrors?.name)}
              required
            />
            {state && !state.success && state.fieldErrors?.name && (
              <p className="text-destructive text-sm">{state.fieldErrors.name[0]}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description (optionnel)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Décris l'univers ou l'objectif de ce projet..."
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="defaultPlatform">Plateforme principale (optionnel)</Label>
            <Select name="defaultPlatform">
              <SelectTrigger id="defaultPlatform" className="w-full">
                <SelectValue placeholder="Choisir une plateforme" />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.filter((p) => p.id !== "multi").map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    {platform.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {state && !state.success && !state.fieldErrors && (
            <p role="alert" className="text-destructive text-sm">
              {state.error}
            </p>
          )}

          <Button type="submit" disabled={isPending} className="w-fit">
            {isPending && <Loader2 className="animate-spin" />}
            Créer le projet
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
