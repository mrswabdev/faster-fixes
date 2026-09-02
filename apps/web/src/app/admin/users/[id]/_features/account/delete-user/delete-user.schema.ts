import { z } from "zod";

export const DeleteUserSchema = z.object({
  userId: z.string().min(1, "Benutzer-ID ist erforderlich"),
});

export type DeleteUserInputs = z.infer<typeof DeleteUserSchema>;
