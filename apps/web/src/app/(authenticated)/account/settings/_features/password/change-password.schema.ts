import { PasswordSchema } from "@/app/_features/auth/_utils/password.schema";
import z from "zod";

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Aktuelles Passwort ist erforderlich"),
    newPassword: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwörter stimmen nicht überein",
    path: ["confirmPassword"],
  });

export type ChangePasswordInputs = z.infer<typeof ChangePasswordSchema>;
