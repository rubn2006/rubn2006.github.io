import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Plus, Users } from "lucide-react";

import { EmptyState } from "@/components/app-shell/empty-state";
import { PageHeader } from "@/components/app-shell/page-header";
import { CharacterCard } from "@/components/characters/character-card";
import { ProjectActionsMenu } from "@/components/projects/project-actions-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireCurrentUserContext } from "@/lib/auth/current-user";
import { resolveCharacterImageUrls } from "@/lib/characters/resolve-images";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Détail du projet",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const ctx = await requireCurrentUserContext();
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", ctx.userId)
    .maybeSingle();

  if (!project) notFound();

  const { data: characters } = await supabase
    .from("characters")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  const imageUrls = await resolveCharacterImageUrls(supabase, characters ?? []);

  return (
    <div>
      <PageHeader
        title={project.name}
        description={project.description ?? undefined}
        actions={
          <>
            <Badge variant="outline">{project.type === "series" ? "Série" : "Publicité"}</Badge>
            <ProjectActionsMenu projectId={project.id} />
          </>
        }
      />

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Personnages de ce projet</h2>
          <Button asChild size="sm" variant="outline">
            <Link href={`/characters/new?projectId=${project.id}`}>
              <Plus /> Ajouter un personnage
            </Link>
          </Button>
        </div>

        {characters && characters.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {characters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                imageUrl={imageUrls.get(character.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="Aucun personnage lié"
            description="Ajoute un personnage récurrent à ce projet pour garder une apparence et une personnalité cohérentes entre les épisodes."
            action={
              <Button asChild size="sm">
                <Link href={`/characters/new?projectId=${project.id}`}>
                  <Plus /> Ajouter un personnage
                </Link>
              </Button>
            }
          />
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-medium">Épisodes</h2>
        <p className="text-muted-foreground text-sm">
          La génération de scénario et le montage vidéo arrivent dans une prochaine phase. Tes
          personnages sont prêts — reviens bientôt pour créer ton premier épisode.
        </p>
      </section>
    </div>
  );
}
