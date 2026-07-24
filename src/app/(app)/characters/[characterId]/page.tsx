import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Lock, LockOpen, Pencil, Sparkles } from "lucide-react";

import { PageHeader } from "@/components/app-shell/page-header";
import { DeleteCharacterButton } from "@/components/characters/delete-character-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildCharacterConsistencyPrompt } from "@/lib/characters/consistency-prompt";
import { resolveCharacterImageUrls } from "@/lib/characters/resolve-images";
import { requireCurrentUserContext } from "@/lib/auth/current-user";
import { getVoiceOption } from "@/lib/config/voices";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Personnage",
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground text-xs font-medium tracking-wide uppercase">{label}</dt>
      <dd className="mt-0.5 text-sm">{value}</dd>
    </div>
  );
}

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = await params;
  const ctx = await requireCurrentUserContext();
  const supabase = await createClient();

  const { data: character } = await supabase
    .from("characters")
    .select("*")
    .eq("id", characterId)
    .eq("user_id", ctx.userId)
    .maybeSingle();

  if (!character) notFound();

  const imageUrls = await resolveCharacterImageUrls(supabase, [character]);
  const imageUrl = imageUrls.get(character.id);
  const voice = getVoiceOption(character.voice_id);
  const consistencyPrompt = buildCharacterConsistencyPrompt(character);

  return (
    <div>
      <PageHeader
        title={character.name}
        actions={
          <>
            <Badge variant={character.is_locked ? "secondary" : "outline"} className="gap-1">
              {character.is_locked ? <Lock className="size-3" /> : <LockOpen className="size-3" />}
              {character.is_locked ? "Verrouillé" : "Non verrouillé"}
            </Badge>
            <Button asChild variant="outline" size="sm">
              <Link href={`/characters/${character.id}/edit`}>
                <Pencil /> Modifier
              </Link>
            </Button>
            <DeleteCharacterButton characterId={character.id} name={character.name} />
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card className="overflow-hidden py-0">
            <div className="bg-muted relative flex aspect-square items-center justify-center">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={character.name}
                  fill
                  sizes="320px"
                  className="object-cover"
                />
              ) : (
                <Sparkles className="text-muted-foreground size-10" aria-hidden />
              )}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Fiche</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4">
                <InfoRow
                  label="Type"
                  value={
                    character.species === "other"
                      ? (character.species_other ?? "Autre")
                      : character.species
                  }
                />
                {character.universe && <InfoRow label="Univers" value={character.universe} />}
                <InfoRow label="Émotion par défaut" value={character.default_emotion} />
                <InfoRow
                  label="Voix"
                  value={voice ? `${voice.name} — ${voice.description}` : "Aucune"}
                />
                {character.primary_colors.length > 0 && (
                  <InfoRow label="Couleurs" value={character.primary_colors.join(", ")} />
                )}
                {character.accessories.length > 0 && (
                  <InfoRow label="Accessoires" value={character.accessories.join(", ")} />
                )}
              </dl>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          {character.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{character.description}</p>
              </CardContent>
            </Card>
          )}

          {character.personality && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Personnalité</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground text-sm">{character.personality}</p>
                {character.speech_style && (
                  <p className="text-sm">
                    <span className="font-medium">Manière de parler : </span>
                    {character.speech_style}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Prompt de cohérence généré</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3 text-xs">
                Bloc standardisé injecté automatiquement dans chaque prompt de scène pour garder ce
                personnage identique d&apos;un épisode à l&apos;autre
                (buildCharacterConsistencyPrompt).
              </p>
              <pre className="bg-muted overflow-x-auto rounded-lg p-4 text-xs whitespace-pre-wrap">
                {consistencyPrompt}
              </pre>
              {character.negative_prompt && (
                <p className="text-muted-foreground mt-3 text-xs">
                  <span className="font-medium">Negative prompt : </span>
                  {character.negative_prompt}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
