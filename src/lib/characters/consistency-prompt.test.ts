import { describe, expect, it } from "vitest";

import {
  buildCharacterConsistencyPrompt,
  buildCharacterNegativePrompt,
  buildSceneCharactersPrompt,
  type CharacterConsistencyInput,
} from "./consistency-prompt";

function ruby(overrides: Partial<CharacterConsistencyInput> = {}): CharacterConsistencyInput {
  return {
    name: "Ruby",
    species: "fruit",
    species_other: null,
    description: "Une fraise pleine d'énergie",
    physical_appearance: "Petite fraise ronde avec de grands yeux",
    primary_colors: ["rouge", "vert"],
    accessories: ["petite couronne dorée"],
    clothing: null,
    personality: "Curieuse et loyale",
    speech_style: "Parle vite, beaucoup d'onomatopées",
    default_emotion: "joyeux",
    visual_prompt_locked: "fraise anthropomorphe rouge vif, style cartoon 3D",
    negative_prompt: "pas de texture réaliste, pas de couleurs ternes",
    universe: "FruitDrama",
    is_locked: true,
    ...overrides,
  };
}

describe("buildCharacterConsistencyPrompt", () => {
  it("includes the character name in a locked header", () => {
    const prompt = buildCharacterConsistencyPrompt(ruby());
    expect(prompt).toContain("[PERSONNAGE VERROUILLÉ: Ruby]");
  });

  it("includes appearance, colors, accessories and personality", () => {
    const prompt = buildCharacterConsistencyPrompt(ruby());
    expect(prompt).toContain("Petite fraise ronde avec de grands yeux");
    expect(prompt).toContain("rouge, vert");
    expect(prompt).toContain("petite couronne dorée");
    expect(prompt).toContain("Curieuse et loyale");
  });

  it("adds the lock instruction only when is_locked is true", () => {
    const locked = buildCharacterConsistencyPrompt(ruby({ is_locked: true }));
    const unlocked = buildCharacterConsistencyPrompt(ruby({ is_locked: false }));
    expect(locked).toMatch(/ne jamais modifier/i);
    expect(unlocked).not.toMatch(/ne jamais modifier/i);
  });

  it("omits empty optional fields instead of printing blanks", () => {
    const prompt = buildCharacterConsistencyPrompt(
      ruby({ clothing: null, accessories: [], universe: null }),
    );
    expect(prompt).not.toContain("Vêtements:");
    expect(prompt).not.toContain("Accessoires:");
    expect(prompt).not.toContain("Univers:");
  });

  it("stays stable across repeated calls (deterministic, same character in/out)", () => {
    const character = ruby();
    expect(buildCharacterConsistencyPrompt(character)).toBe(
      buildCharacterConsistencyPrompt(character),
    );
  });
});

describe("buildCharacterNegativePrompt", () => {
  it("returns the trimmed negative prompt when present", () => {
    expect(buildCharacterNegativePrompt(ruby({ negative_prompt: "  no blur  " }))).toBe("no blur");
  });

  it("returns null when there is no negative prompt", () => {
    expect(buildCharacterNegativePrompt(ruby({ negative_prompt: null }))).toBeNull();
    expect(buildCharacterNegativePrompt(ruby({ negative_prompt: "   " }))).toBeNull();
  });
});

describe("buildSceneCharactersPrompt", () => {
  it("joins multiple characters' blocks with a blank line between them", () => {
    const banana = ruby({ name: "Banana", species: "fruit" });
    const prompt = buildSceneCharactersPrompt([ruby(), banana]);
    expect(prompt).toContain("[PERSONNAGE VERROUILLÉ: Ruby]");
    expect(prompt).toContain("[PERSONNAGE VERROUILLÉ: Banana]");
    expect(prompt.indexOf("Ruby")).toBeLessThan(prompt.indexOf("Banana"));
  });
});
