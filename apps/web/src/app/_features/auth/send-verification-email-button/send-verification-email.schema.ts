import { z } from "zod";

export const SendVerificationEmailSchema = z.object({
  email: z.email({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." }),
});

export type SendVerificationEmailInputs = z.infer<
  typeof SendVerificationEmailSchema
>;
