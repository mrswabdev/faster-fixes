"use server";

import { deleteAsset } from "@/server/storage/delete-asset";
import { protectedProcedure } from "@/server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { HardDeleteFeedbackSchema } from "./hard-delete-feedback.schema";

export const hardDeleteFeedback = protectedProcedure
  .input(HardDeleteFeedbackSchema)
  .mutation(async ({ input, ctx }) => {
    const { prisma, session } = ctx;

    const feedback = await prisma.feedback.findUnique({
      where: { id: input.feedbackId },
      include: { project: { select: { organizationId: true } } },
    });

    if (!feedback) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Feedback nicht gefunden." });
    }

    if (feedback.status !== "closed") {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Nur archiviertes Feedback kann dauerhaft gelöscht werden.",
      });
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

    if (feedback.screenshotId) {
      await deleteAsset(feedback.screenshotId);
    }

    // Attachment rows cascade with the feedback/comments, but the R2 objects
    // and Asset rows would be orphaned without this sweep.
    const attachments = await prisma.feedbackAttachment.findMany({
      where: {
        OR: [
          { feedbackId: input.feedbackId },
          { comment: { feedbackId: input.feedbackId } },
        ],
      },
      select: { assetId: true },
    });
    for (const attachment of attachments) {
      await deleteAsset(attachment.assetId);
    }

    await prisma.feedback.delete({
      where: { id: input.feedbackId },
    });

    return { id: input.feedbackId };
  });
