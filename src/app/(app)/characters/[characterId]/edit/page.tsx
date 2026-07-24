import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { updateCharacter } from "@/app/(app)/characters/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { CharacterForm } from "@/components/characters/character-form";
import { requireCurrentUserContext } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Modifier le personnage",
};

export default async function EditCharacterPage({
  params,
}: {
  params: Promise<{ characterId: string }>;
}) {
  const { characterId } = await params;
  const ctx = await requireCurrentUserContext();
  const supabase = await createClient();

  const [{ data: character }, { data: projects }] = await Promise.all([
    supabase
      .from("characters")
      .select("*")
      .eq("id", characterId)
      .eq("user_id", ctx.userId)
      .maybeSingle(),
    supabase
      .from("projects")
      .select("*")
      .eq("user_id", ctx.userId)
      .eq("is_archived", false)
      .order("created_at", { ascending: false }),
  ]);

  if (!character) notFound();

  const boundUpdate = updateCharacter.bind(null, character.id);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={`Modifier ${character.name}`} />
      <CharacterForm action={boundUpdate} character={character} projects={projects ?? []} />
    </div>
  );
}
