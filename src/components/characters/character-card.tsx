import Link from "next/link";
import Image from "next/image";
import { Lock, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Tables } from "@/types/database";

const SPECIES_LABELS: Record<Tables<"characters">["species"], string> = {
  fruit: "Fruit",
  animal: "Animal",
  human: "Humain",
  brainrot: "Brainrot",
  mascot: "Mascotte",
  object: "Objet",
  other: "Autre",
};

export function CharacterCard({
  character,
  imageUrl,
}: {
  character: Tables<"characters">;
  imageUrl?: string;
}) {
  return (
    <Link href={`/characters/${character.id}`}>
      <Card className="hover:border-primary/50 h-full overflow-hidden transition-colors">
        <div className="bg-muted relative flex aspect-square items-center justify-center">
          {imageUrl ? (
            <Image src={imageUrl} alt="" fill sizes="240px" className="object-cover" />
          ) : (
            <Sparkles className="text-muted-foreground size-8" aria-hidden />
          )}
          {character.is_locked && (
            <div className="bg-background/90 absolute top-2 right-2 flex size-6 items-center justify-center rounded-full">
              <Lock className="size-3" aria-hidden />
            </div>
          )}
        </div>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="line-clamp-1 font-medium">{character.name}</h3>
            <Badge variant="outline" className="shrink-0">
              {character.species === "other" && character.species_other
                ? character.species_other
                : SPECIES_LABELS[character.species]}
            </Badge>
          </div>
          {character.personality && (
            <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
              {character.personality}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
