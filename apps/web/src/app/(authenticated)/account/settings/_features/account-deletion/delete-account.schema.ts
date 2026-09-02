import z from "zod";

export const DeleteAccountSchema = z.object({
  password: z.string().min(1, "Passwort ist zur Bestätigung erforderlich"),
});

export type DeleteAccountInputs = z.infer<typeof DeleteAccountSchema>;
