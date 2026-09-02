import { z } from "zod";

export const RevokeUserSessionsSchema = z.object({
  userId: z.string().min(1, "Benutzer-ID ist erforderlich"),
});

export type RevokeUserSessionsInputs = z.infer<typeof RevokeUserSessionsSchema>;
