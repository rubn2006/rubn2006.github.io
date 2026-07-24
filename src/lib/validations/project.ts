import { z } from "zod";

export const projectFormSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis").max(100, "100 caractères maximum"),
  description: z.string().trim().max(1000).optional(),
  type: z.enum(["series", "standalone_ad"]),
  defaultPlatform: z.enum(["tiktok", "instagram_reels", "youtube_shorts"]).optional(),
});

export type ProjectFormInput = z.infer<typeof projectFormSchema>;
