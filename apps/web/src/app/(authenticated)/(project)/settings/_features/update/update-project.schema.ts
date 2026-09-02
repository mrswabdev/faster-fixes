import z from "zod";

import { DomainSchema } from "@/app/_features/project/normalize-domain";

export const UpdateProjectSchema = z.object({
  projectId: z.string(),
  name: z.string().trim().min(1, "Name ist erforderlich"),
  domain: DomainSchema,
  widgetEnabled: z.boolean(),
});

export type UpdateProjectInputs = z.infer<typeof UpdateProjectSchema>;
