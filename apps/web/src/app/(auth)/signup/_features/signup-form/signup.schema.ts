import { PasswordSchema } from "@/app/_features/auth/_utils/password.schema";
import { z } from "zod";

export const SignupSchema = z
  .object({
    email: z.email("Ungültige E-Mail-Adresse"),
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

export type SignupInputs = z.infer<typeof SignupSchema>;
