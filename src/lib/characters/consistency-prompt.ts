import type { Tables } from "@/types/database";

export type CharacterConsistencyInput = Pick<
  Tables<"characters">,
  | "name"
  | "species"
  | "species_other"
  | "description"
  | "physical_appearance"
  | "primary_colors"
  | "accessories"
  | "clothing"
  | "personality"
  | "speech_style"
  | "default_emotion"
  | "visual_prompt_locked"
  | "negative_prompt"
  | "universe"
  | "is_locked"
>;

const SPECIES_LABELS: Record<Tables<"characters">["species"], string> = {
  fruit: "Fruit personnifié",
  animal: "Animal personnifié",
  human: "Personnage humain fictif",
  brainrot: "Personnage brainrot",
  mascot: "Mascotte de marque",
  object: "Objet personnifié",
  other: "Personnage",
};

function speciesLabel(character: CharacterConsistencyInput): string {
  if (character.species === "other" && character.species_other) {
    return character.species_other;
  }
  return SPECIES_LABELS[character.species];
}

/**
 * Standardized, reusable prompt block for a character — the single place
 * every scene/episode generator pulls character identity from, so the same
 * character reads the same way across every scene and episode. Never build
 * an ad-hoc character description elsewhere; always go through this.
 */
export function buildCharacterConsistencyPrompt(character: CharacterConsistencyInput): string {
  const lines: string[] = [];

  lines.push(`[PERSONNAGE VERROUILLÉ: ${character.name}]`);
  lines.push(`Type: ${speciesLabel(character)}`);

  if (character.physical_appearance) {
    lines.push(`Apparence physique: ${character.physical_appearance}`);
  }
  if (character.primary_colors.length > 0) {
    lines.push(`Couleurs principales: ${character.primary_colors.join(", ")}`);
  }
  if (character.accessories.length > 0) {
    lines.push(`Accessoires: ${character.accessories.join(", ")}`);
  }
  if (character.clothing) {
    lines.push(`Vêtements: ${character.clothing}`);
  }
  if (character.personality) {
    lines.push(`Personnalité: ${character.personality}`);
  }
  if (character.speech_style) {
    lines.push(`Manière de parler: ${character.speech_style}`);
  }
  lines.push(`Émotion par défaut: ${character.default_emotion}`);
  if (character.universe) {
    lines.push(`Univers: ${character.universe}`);
  }
  if (character.visual_prompt_locked) {
    lines.push(`Prompt visuel verrouillé: ${character.visual_prompt_locked}`);
  }

  if (character.is_locked) {
    lines.push(
      "Consigne: ne jamais modifier l'apparence, les couleurs, les accessoires ou la personnalité établis de ce personnage, quelle que soit la scène.",
    );
  }

  return lines.join("\n");
}

/** Negative prompt for this character alone; callers merge with scene/episode-level negatives. */
export function buildCharacterNegativePrompt(character: CharacterConsistencyInput): string | null {
  return character.negative_prompt?.trim() || null;
}

/** Combines multiple characters' locked prompt blocks for a multi-character scene. */
export function buildSceneCharactersPrompt(characters: CharacterConsistencyInput[]): string {
  return characters.map(buildCharacterConsistencyPrompt).join("\n\n");
}
