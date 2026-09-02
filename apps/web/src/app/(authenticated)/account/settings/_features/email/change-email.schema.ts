import z from "zod";

export const ChangeEmailSchema = z.object({
  newEmail: z
    .email("Bitte geben Sie eine gültige E-Mail-Adresse ein")
    .trim()
    .toLowerCase(),
});

export type ChangeEmailInputs = z.infer<typeof ChangeEmailSchema>;
