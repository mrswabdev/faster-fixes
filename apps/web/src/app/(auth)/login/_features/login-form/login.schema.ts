import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email("Ungültige E-Mail-Adresse"),
  password: z.string().min(1, "Passwort ist erforderlich"),
});

export type LoginInputs = z.infer<typeof LoginSchema>;
