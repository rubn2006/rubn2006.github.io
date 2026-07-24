import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().trim().min(2, "2 caractères minimum").max(100, "100 caractères maximum"),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
