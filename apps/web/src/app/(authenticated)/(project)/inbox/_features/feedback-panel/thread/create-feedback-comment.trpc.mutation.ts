"use server";

import { inngest } from "@/server/inngest";
import { createAsset } from "@/server/storage/create-asset";
import { protectedProcedure } from "@/server/trpc/trpc";
import { TRPCError, type inferProcedureOutput } from "@trpc/server";
import { CreateFeedbackCommentSchema } from "./create-feedback-comment.schema";

export const createFeedbackComment = protectedProcedure
  .input(CreateFeedbackCommentSchema)
  .mutation(async ({ input, ctx }) => {
    const { prisma, session } = ctx;

    const feedback = await prisma.feedback.findUnique({
      where: { id: input.feedbackId },
      include: { project: { select: { id: true, organizationId: true } } },
    });
    if (!feedback) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Feedback nicht gefunden." });
    }

    const membership = await prisma.member.findFirst({
      where: {
        organizationId: feedback.project.organizationId,
        userId: session.user.id,
      },
    });
    if (!membership) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Zugriff verweigert." });
    }

    // The presign route generates keys under this exact prefix; anything else
    // would let a member register arbitrary bucket objects as attachments.
    const expectedPrefix = `feedback-attachments/${feedback.project.id}/`;
    for (const attachment of input.attachments) {
      if (!attachment.key.startsWith(expectedPrefix)) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Ungültiger Anhang-Schlüssel." });
      }
    }

    const assets = await Promise.all(
      input.attachments.map((attachment) =>
        createAsset({
          key: attachment.key,
          bucket: process.env.STORAGE_BUCKET_NAME!,
          provider: "r2",
          filename: attachment.filename,
          mimeType: attachment.mimeType,
          size: attachment.size,
          uploadedById: session.user.id,
        }),
      ),
    );

    const comment = await prisma.feedbackComment.create({
      data: {
        feedbackId: input.feedbackId,
        authorType: "member",
        memberId: membership.id,
        body: input.body,
        attachments: {
          create: assets.map((asset) => ({ assetId: asset.id })),
        },
      },
    });

    inngest
      .send({
        name: "feedback/comment-created",
        data: {
          feedbackId: input.feedbackId,
          commentId: comment.id,
          authorType: "member",
        },
      })
      .catch(() => {});

    return { id: comment.id };
  });

export type CreateFeedbackCommentOutput = inferProcedureOutput<
  typeof createFeedbackComment
>;
