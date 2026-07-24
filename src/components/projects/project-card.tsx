import Link from "next/link";
import { Clapperboard, Megaphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tables } from "@/types/database";
import { formatDate } from "@/lib/utils";

export function ProjectCard({ project }: { project: Tables<"projects"> }) {
  const Icon = project.type === "series" ? Clapperboard : Megaphone;

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="hover:border-primary/50 h-full transition-colors">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-lg">
              <Icon className="size-4" aria-hidden />
            </div>
            <Badge variant="outline">{project.type === "series" ? "Série" : "Publicité"}</Badge>
          </div>
          <CardTitle className="mt-2 line-clamp-1">{project.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {project.description ? (
            <p className="text-muted-foreground line-clamp-2 text-sm">{project.description}</p>
          ) : (
            <p className="text-muted-foreground text-sm italic">Pas de description</p>
          )}
          <p className="text-muted-foreground mt-3 text-xs">
            Créé le {formatDate(project.created_at)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
