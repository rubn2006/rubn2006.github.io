"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { MOCK_VOICES } from "@/lib/config/voices";
import type { ActionResult } from "@/lib/action-result";
import type { Tables } from "@/types/database";

const SPECIES_OPTIONS: { id: Tables<"characters">["species"]; label: string }[] = [
  { id: "fruit", label: "Fruit personnifié" },
  { id: "animal", label: "Animal personnifié" },
  { id: "human", label: "Personnage humain fictif" },
  { id: "brainrot", label: "Personnage brainrot" },
  { id: "mascot", label: "Mascotte de marque" },
  { id: "object", label: "Objet personnifié" },
  { id: "other", label: "Autre" },
];

const EMOTIONS = [
  "neutre",
  "joyeux",
  "triste",
  "en colère",
  "surpris",
  "effrayé",
  "amoureux",
  "confus",
];

export function CharacterForm<T = undefined>({
  action,
  character,
  projects,
  defaultProjectId,
}: {
  action: (prev: ActionResult<T> | null, formData: FormData) => Promise<ActionResult<T>>;
  character?: Tables<"characters">;
  projects: Tables<"projects">[];
  defaultProjectId?: string;
}) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [species, setSpecies] = useState<Tables<"characters">["species"]>(
    character?.species ?? "fruit",
  );

  const fieldError = (name: string) =>
    state && !state.success ? state.fieldErrors?.[name]?.[0] : undefined;

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Identité</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              name="name"
              defaultValue={character?.name}
              placeholder="Ex : Ruby"
              aria-invalid={Boolean(fieldError("name"))}
              required
            />
            {fieldError("name") && <p className="text-destructive text-sm">{fieldError("name")}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="species">Espèce / type</Label>
            <Select
              name="species"
              value={species}
              onValueChange={(value) => setSpecies(value as Tables<"characters">["species"])}
            >
              <SelectTrigger id="species" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SPECIES_OPTIONS.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {species === "other" && (
            <div className="grid gap-2">
              <Label htmlFor="speciesOther">Précise le type</Label>
              <Input
                id="speciesOther"
                name="speciesOther"
                defaultValue={character?.species_other ?? ""}
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="projectId">Projet (optionnel)</Label>
            <Select name="projectId" defaultValue={character?.project_id ?? defaultProjectId ?? ""}>
              <SelectTrigger id="projectId" className="w-full">
                <SelectValue placeholder="Aucun projet" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="universe">Univers / série associée</Label>
            <Input
              id="universe"
              name="universe"
              defaultValue={character?.universe ?? ""}
              placeholder="Ex : FruitDrama"
            />
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={character?.description ?? ""}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Apparence</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="physicalAppearance">Apparence physique</Label>
            <Textarea
              id="physicalAppearance"
              name="physicalAppearance"
              defaultValue={character?.physical_appearance ?? ""}
              rows={3}
              placeholder="Forme, texture, visage, taille..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="primaryColors">Couleurs principales</Label>
            <Input
              id="primaryColors"
              name="primaryColors"
              defaultValue={character?.primary_colors.join(", ") ?? ""}
              placeholder="rouge, vert"
            />
            <p className="text-muted-foreground text-xs">Séparées par des virgules</p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="accessories">Accessoires</Label>
            <Input
              id="accessories"
              name="accessories"
              defaultValue={character?.accessories.join(", ") ?? ""}
              placeholder="petite couronne dorée"
            />
            <p className="text-muted-foreground text-xs">Séparés par des virgules</p>
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="clothing">Vêtements</Label>
            <Input id="clothing" name="clothing" defaultValue={character?.clothing ?? ""} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Personnalité &amp; voix</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="personality">Personnalité</Label>
            <Textarea
              id="personality"
              name="personality"
              defaultValue={character?.personality ?? ""}
              rows={3}
            />
          </div>
          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="speechStyle">Manière de parler</Label>
            <Input
              id="speechStyle"
              name="speechStyle"
              defaultValue={character?.speech_style ?? ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="defaultEmotion">Émotion par défaut</Label>
            <Select name="defaultEmotion" defaultValue={character?.default_emotion ?? "neutre"}>
              <SelectTrigger id="defaultEmotion" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EMOTIONS.map((emotion) => (
                  <SelectItem key={emotion} value={emotion}>
                    {emotion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="voiceId">Voix</Label>
            <Select name="voiceId" defaultValue={character?.voice_id ?? ""}>
              <SelectTrigger id="voiceId" className="w-full">
                <SelectValue placeholder="Aucune voix choisie" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_VOICES.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    {voice.name} — {voice.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Catalogue de démonstration (mode MOCK). Se connecte à un vrai fournisseur de voix en
              phase 3.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cohérence du personnage</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="visualPromptLocked">Prompt visuel verrouillé</Label>
            <Textarea
              id="visualPromptLocked"
              name="visualPromptLocked"
              defaultValue={character?.visual_prompt_locked ?? ""}
              rows={3}
              placeholder="Description visuelle exacte réutilisée telle quelle dans chaque scène..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="negativePrompt">Negative prompt</Label>
            <Textarea
              id="negativePrompt"
              name="negativePrompt"
              defaultValue={character?.negative_prompt ?? ""}
              rows={2}
              placeholder="Éléments à toujours éviter pour ce personnage..."
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <Label htmlFor="isLocked" className="text-sm font-medium">
                Verrouiller ce personnage
              </Label>
              <p className="text-muted-foreground text-xs">
                Empêche la génération de modifier automatiquement son apparence ou sa personnalité.
              </p>
            </div>
            <Switch id="isLocked" name="isLocked" defaultChecked={character?.is_locked ?? true} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Image de référence</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="referenceImage">
              {character ? "Remplacer l'image principale" : "Image principale (optionnel)"}
            </Label>
            <Input
              id="referenceImage"
              name="referenceImage"
              type="file"
              accept="image/png,image/jpeg,image/webp"
            />
            {fieldError("referenceImage") && (
              <p className="text-destructive text-sm">{fieldError("referenceImage")}</p>
            )}
            <p className="text-muted-foreground text-xs">PNG, JPEG ou WebP, 15 Mo maximum.</p>
          </div>
          <Separator />
          <div className="flex items-start gap-3">
            <Checkbox
              id="rightsConfirmed"
              name="rightsConfirmed"
              defaultChecked={character?.rights_confirmed}
            />
            <Label htmlFor="rightsConfirmed" className="text-sm leading-snug font-normal">
              Je confirme posséder les droits sur les images que j&apos;importe pour ce personnage
              (pas d&apos;usurpation, pas de deepfake de personne réelle, pas de contenu protégé
              sans autorisation).
            </Label>
          </div>
        </CardContent>
      </Card>

      {state && !state.success && !state.fieldErrors && (
        <p role="alert" className="text-destructive text-sm">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          {character ? "Enregistrer les modifications" : "Créer le personnage"}
        </Button>
        <Button asChild variant="ghost" type="button">
          <Link href={character ? `/characters/${character.id}` : "/characters"}>Annuler</Link>
        </Button>
      </div>
    </form>
  );
}
