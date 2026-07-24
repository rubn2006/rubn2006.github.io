import type { Metadata } from "next";

import { createCharacter } from "@/app/(app)/characters/actions";
import { PageHeader } from "@/components/app-shell/page-header";
import { CharacterForm } from "@/components/characters/character-form";
import { requireCurrentUserContext } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Nouveau personnage",
};

export default async function NewCharacterPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>;
}) {
  const { projectId } = await searchParams;
  const ctx = await requireCurrentUserContext();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", ctx.userId)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Nouveau personnage"
        description="Plus la fiche est précise, plus le personnage restera cohérent d'une scène à l'autre."
      />
      <CharacterForm
        action={createCharacter}
        projects={projects ?? []}
        defaultProjectId={projectId}
      />
    </div>
  );
}
