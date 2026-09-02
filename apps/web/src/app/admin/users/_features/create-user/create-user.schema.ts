import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.email("Ungültige E-Mail-Adresse"),
  name: z.string().min(1, "Name ist erforderlich").max(255),
  firstName: z.string().max(255).optional().or(z.literal("")),
  lastName: z.string().max(255).optional().or(z.literal("")),
});

export type CreateUserInputs = z.infer<typeof CreateUserSchema>;
