"use server";

import { getSignedAssetUrl } from "@/server/storage/get-signed-asset-url";
import { protectedProcedure } from "@/server/trpc/trpc";
import { TRPCError, type inferProcedureOutput } from "@trpc/server";
import { z } from "zod";

export const getFeedbackComments = protectedProcedure
  .input(z.object({ feedbackId: z.string() }))
  .query(async ({ input, ctx }) => {
    const { prisma, session } = ctx;

    const feedback = await prisma.feedback.findUnique({
      where: { id: input.feedbackId },
      include: { project: { select: { organizationId: true } } },
    });
    if (!feedback) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Feedback not found." });
    }

    const membership = await prisma.member.findFirst({
      where: {
        organizationId: feedback.project.organizationId,
        userId: session.user.id,
      },
    });
    if (!membership) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Access denied." });
    }

    const comments = await prisma.feedbackComment.findMany({
      where: { feedbackId: input.feedbackId },
      orderBy: { createdAt: "asc" },
      include: {
        member: { select: { id: true, user: { select: { name: true } } } },
        reviewer: { select: { id: true, name: true } },
        attachments: {
          include: {
            asset: {
              select: {
                key: true,
                bucket: true,
                filename: true,
                mimeType: true,
                size: true,
              },
            },
          },
        },
      },
    });

    return Promise.all(
      comments.map(async (c) => ({
        id: c.id,
        body: c.body,
        authorType: c.authorType as "member" | "reviewer",
        authorName:
          c.authorType === "member"
            ? (c.member?.user.name ?? null)
            : (c.reviewer?.name ?? null),
        createdAt: c.createdAt,
        attachments: await Promise.all(
          c.attachments.map(async (a) => ({
            id: a.id,
            filename: a.asset.filename,
            mimeType: a.asset.mimeType,
            size: a.asset.size,
            url: await getSignedAssetUrl(a.asset),
          })),
        ),
      })),
    );
  });

export type GetFeedbackCommentsOutput = inferProcedureOutput<
  typeof getFeedbackComments
>;
