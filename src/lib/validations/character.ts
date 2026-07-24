import { z } from "zod";

const speciesEnum = z.enum(["fruit", "animal", "human", "brainrot", "mascot", "object", "other"]);

function csvToArray(value: unknown): string[] {
  if (typeof value !== "string") return [];
  return value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

export const characterFormSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis").max(80, "80 caractères maximum"),
  species: speciesEnum,
  speciesOther: z.string().trim().max(60).optional(),
  description: z.string().trim().max(2000).optional(),
  physicalAppearance: z.string().trim().max(2000).optional(),
  primaryColors: z.preprocess(csvToArray, z.array(z.string().max(40))).default([]),
  accessories: z.preprocess(csvToArray, z.array(z.string().max(60))).default([]),
  clothing: z.string().trim().max(500).optional(),
  personality: z.string().trim().max(2000).optional(),
  speechStyle: z.string().trim().max(500).optional(),
  defaultEmotion: z.string().trim().min(1).max(50).default("neutre"),
  voiceId: z.string().trim().max(80).optional(),
  visualPromptLocked: z.string().trim().max(2000).optional(),
  negativePrompt: z.string().trim().max(1000).optional(),
  universe: z.string().trim().max(200).optional(),
  isLocked: z.coerce.boolean().default(true),
  rightsConfirmed: z.coerce.boolean(),
  projectId: z.string().uuid().optional().or(z.literal("")),
  seriesId: z.string().uuid().optional().or(z.literal("")),
});

export type CharacterFormInput = z.infer<typeof characterFormSchema>;
