import Link from "next/link";
import type { Metadata } from "next";
import { Clapperboard, FolderKanban, Plus, Sparkles, Users } from "lucide-react";

import { PageHeader } from "@/components/app-shell/page-header";
import { CharacterCard } from "@/components/characters/character-card";
import { ProjectCard } from "@/components/projects/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { requireCurrentUserContext } from "@/lib/auth/current-user";
import { resolveCharacterImageUrls } from "@/lib/characters/resolve-images";
import { getPlan } from "@/lib/config/pricing";
import { createClient } from "@/lib/supabase/server";
import { formatCredits } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tableau de bord",
};

const STARTER_IDEAS = [
  "La fraise découvre que la banane lui a menti pendant la soirée.",
  "Le kiwi organise une fête surprise qui tourne au chaos.",
  "L'ananas essaie désespérément de rentrer dans le groupe des agrumes.",
  "La pastèque perd son plus grand secret devant tout le monde.",
];

export default async function DashboardPage() {
  const ctx = await requireCurrentUserContext();
  const supabase = await createClient();
  const plan = getPlan(ctx.subscription?.plan ?? "free");

  const [projectsRes, charactersRes, projectCountRes, characterCountRes, jobsRes] =
    await Promise.all([
      supabase
        .from("projects")
        .select("*")
        .eq("user_id", ctx.userId)
        .eq("is_archived", false)
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("characters")
        .select("*")
        .eq("user_id", ctx.userId)
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("user_id", ctx.userId),
      supabase
        .from("characters")
        .select("id", { count: "exact", head: true })
        .eq("user_id", ctx.userId),
      supabase
        .from("generation_jobs")
        .select("*")
        .eq("user_id", ctx.userId)
        .in("status", ["queued", "processing", "awaiting_provider"])
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  const projects = projectsRes.data ?? [];
  const characters = charactersRes.data ?? [];
  const activeJobs = jobsRes.data ?? [];
  const imageUrls = await resolveCharacterImageUrls(supabase, characters);

  return (
    <div>
      <PageHeader
        title={`Bonjour${ctx.profile.full_name ? `, ${ctx.profile.full_name.split(" ")[0]}` : ""}`}
        description="Voici un aperçu de tes projets et personnages."
        actions={
          <Button asChild>
            <Link href="/projects/new">
              <Plus /> Nouvelle vidéo
            </Link>
          </Button>
        }
      />

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
              <Sparkles className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{formatCredits(ctx.wallet.balance)}</p>
              <p className="text-muted-foreground text-xs">Crédits restants</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="bg-secondary text-secondary-foreground flex size-10 items-center justify-center rounded-lg">
              <Badge variant="outline" className="border-0 p-0 text-sm font-semibold">
                {plan.name}
              </Badge>
            </div>
            <div>
              <Link href="/settings/billing" className="text-sm font-medium hover:underline">
                Gérer l&apos;abonnement
              </Link>
              <p className="text-muted-foreground text-xs">Forfait actuel</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <FolderKanban className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{projectCountRes.count ?? 0}</p>
              <p className="text-muted-foreground text-xs">Projets</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="bg-muted flex size-10 items-center justify-center rounded-lg">
              <Users className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{characterCountRes.count ?? 0}</p>
              <p className="text-muted-foreground text-xs">Personnages</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Générations en cours</h2>
        </div>
        {activeJobs.length > 0 ? (
          <div className="space-y-2">
            {activeJobs.map((job) => (
              <Card key={job.id}>
                <CardContent className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium">{job.step ?? job.job_type}</p>
                    <p className="text-muted-foreground text-xs">
                      {job.user_message ?? job.status}
                    </p>
                  </div>
                  <Badge variant="outline">{job.progress}%</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            Aucune génération en cours pour le moment.
          </p>
        )}
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Projets récents</h2>
          <Link href="/projects" className="text-muted-foreground hover:text-foreground text-sm">
            Voir tout
          </Link>
        </div>
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-muted-foreground text-sm">
                Tu n&apos;as pas encore de projet. Crée le premier pour commencer.
              </p>
              <Button asChild size="sm">
                <Link href="/projects/new">
                  <Plus /> Nouveau projet
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Tes personnages</h2>
          <Link href="/characters" className="text-muted-foreground hover:text-foreground text-sm">
            Voir tout
          </Link>
        </div>
        {characters.length > 0 ? (
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
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <p className="text-muted-foreground text-sm">
                Crée ton premier personnage — par exemple une fraise nommée Ruby.
              </p>
              <Button asChild size="sm">
                <Link href="/characters/new">
                  <Plus /> Créer un personnage
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-medium">Besoin d&apos;inspiration ?</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {STARTER_IDEAS.map((idea) => (
            <Card key={idea}>
              <CardContent className="flex items-start gap-3 py-4">
                <Clapperboard className="text-muted-foreground mt-0.5 size-4 shrink-0" />
                <p className="text-sm">{idea}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
