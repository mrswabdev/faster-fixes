import { z } from "zod";

export const ImpersonateUserSchema = z.object({
  userId: z.string().min(1, "Benutzer-ID ist erforderlich"),
});

export type ImpersonateUserInputs = z.infer<typeof ImpersonateUserSchema>;
