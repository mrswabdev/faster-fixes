import z from "zod";

export const CreateReviewerSchema = z.object({
  projectId: z.string(),
  name: z.string().trim().min(1, "Name ist erforderlich"),
});

export type CreateReviewerInputs = z.infer<typeof CreateReviewerSchema>;
