import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "L'adresse email est requise")
  .email("Adresse email invalide");

export const passwordSchema = z
  .string()
  .min(8, "8 caractères minimum")
  .max(72, "72 caractères maximum")
  .regex(/[a-z]/, "Doit contenir une minuscule")
  .regex(/[A-Z]/, "Doit contenir une majuscule")
  .regex(/[0-9]/, "Doit contenir un chiffre");

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, "2 caractères minimum").max(100, "100 caractères maximum"),
  email: emailSchema,
  password: passwordSchema,
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Le mot de passe est requis"),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const magicLinkSchema = z.object({
  email: emailSchema,
});
export type MagicLinkInput = z.infer<typeof magicLinkSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
