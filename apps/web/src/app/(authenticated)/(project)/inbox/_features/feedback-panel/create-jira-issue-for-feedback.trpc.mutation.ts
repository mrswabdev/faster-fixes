"use server";

import { inngest } from "@/server/inngest";
import { protectedProcedure } from "@/server/trpc/trpc";
import { TRPCError, inferProcedureOutput } from "@trpc/server";
import { z } from "zod";

export const createJiraIssueForFeedback = protectedProcedure
  .input(z.object({ feedbackId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const { prisma, session } = ctx;

    const feedback = await prisma.feedback.findUnique({
      where: { id: input.feedbackId },
      include: {
        project: {
          select: {
            organizationId: true,
            jiraLink: { select: { id: true } },
          },
        },
        jiraIssueLink: { select: { id: true } },
      },
    });

    if (!feedback) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Feedback nicht gefunden.",
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

    if (feedback.jiraIssueLink) {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Für dieses Feedback existiert bereits ein Jira-Issue.",
      });
    }

    if (!feedback.project.jiraLink) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Kein Jira-Projekt mit diesem Projekt verknüpft.",
      });
    }

    await inngest.send({
      name: "feedback/integration-issue-requested",
      data: { feedbackId: input.feedbackId, target: "jira" },
    });

    return { queued: true };
  });

export type CreateJiraIssueForFeedbackOutput = inferProcedureOutput<
  typeof createJiraIssueForFeedback
>;
