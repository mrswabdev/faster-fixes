import { z } from "zod";

export const ForgotPasswordSchema = z.object({
  email: z.email("Ungültige E-Mail-Adresse"),
});

export type ForgotPasswordInputs = z.infer<typeof ForgotPasswordSchema>;
