import Link from "next/link";
import type { Metadata } from "next";
import { Plus, Users } from "lucide-react";

import { EmptyState } from "@/components/app-shell/empty-state";
import { PageHeader } from "@/components/app-shell/page-header";
import { CharacterCard } from "@/components/characters/character-card";
import { Button } from "@/components/ui/button";
import { requireCurrentUserContext } from "@/lib/auth/current-user";
import { resolveCharacterImageUrls } from "@/lib/characters/resolve-images";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Personnages",
};

export default async function CharactersPage() {
  const ctx = await requireCurrentUserContext();
  const supabase = await createClient();

  const { data: characters } = await supabase
    .from("characters")
    .select("*")
    .eq("user_id", ctx.userId)
    .order("created_at", { ascending: false });

  const imageUrls = await resolveCharacterImageUrls(supabase, characters ?? []);

  return (
    <div>
      <PageHeader
        title="Personnages"
        description="Tes personnages récurrents, avec leur apparence, leur voix et leur personnalité verrouillées."
        actions={
          <Button asChild>
            <Link href="/characters/new">
              <Plus /> Nouveau personnage
            </Link>
          </Button>
        }
      />

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
          title="Aucun personnage pour le moment"
          description="Crée ton premier personnage — par exemple une fraise nommée Ruby — pour commencer à générer des épisodes cohérents."
          action={
            <Button asChild>
              <Link href="/characters/new">
                <Plus /> Créer mon premier personnage
              </Link>
            </Button>
          }
        />
      )}
    </div>
  );
}
