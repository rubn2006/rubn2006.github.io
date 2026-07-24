import Link from "next/link";
import type { Metadata } from "next";
import { FolderKanban, Plus } from "lucide-react";

import { EmptyState } from "@/components/app-shell/empty-state";
import { PageHeader } from "@/components/app-shell/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import { requireCurrentUserContext } from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Projets",
};

export default async function ProjectsPage() {
  const ctx = await requireCurrentUserContext();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", ctx.userId)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Projets"
        description="Tes séries et vidéos publicitaires."
        actions={
          <Button asChild>
            <Link href="/projects/new">
              <Plus /> Nouveau projet
            </Link>
          </Button>
        }
      />

      {projects && projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderKanban}
          title="Aucun projet pour le moment"
          description="Crée ton premier projet pour commencer à générer des épisodes avec des personnages cohérents."
          action={
            <Button asChild>
              <Link href="/projects/new">
                <Plus /> Nouveau projet
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
