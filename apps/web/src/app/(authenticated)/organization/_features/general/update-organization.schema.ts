import z from "zod";

export const UpdateOrganizationSchema = z.object({
  organizationId: z.string(),
  name: z.string().trim().min(1, "Name ist erforderlich"),
});

export type UpdateOrganizationInputs = z.infer<typeof UpdateOrganizationSchema>;
