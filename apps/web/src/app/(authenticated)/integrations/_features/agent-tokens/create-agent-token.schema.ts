import { z } from "zod";

export const CreateAgentTokenSchema = z.object({
  organizationId: z.string(),
  name: z.string().trim().min(1, "Name ist erforderlich").max(100),
  scopes: z
    .array(
      z.enum([
        "feedbacks:read",
        "feedbacks:update_status",
        "feedbacks:create",
      ]),
    )
    .min(1, "Wählen Sie mindestens eine Berechtigung"),
});

export type CreateAgentTokenSchemaType = z.infer<typeof CreateAgentTokenSchema>;
