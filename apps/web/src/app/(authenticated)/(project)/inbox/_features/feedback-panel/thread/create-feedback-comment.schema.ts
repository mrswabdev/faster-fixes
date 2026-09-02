import { z } from "zod";

export const CreateFeedbackCommentSchema = z.object({
  feedbackId: z.string(),
  body: z.string().trim().min(1),
  attachments: z
    .array(
      z.object({
        key: z.string().min(1),
        filename: z.string().min(1).max(140),
        mimeType: z.enum([
          "image/png",
          "image/jpeg",
          "image/webp",
          "image/gif",
          "application/pdf",
        ]),
        size: z
          .number()
          .int()
          .positive()
          .max(10 * 1024 * 1024),
      }),
    )
    .max(4)
    .default([]),
});

export type CreateFeedbackCommentInput = z.infer<
  typeof CreateFeedbackCommentSchema
>;
