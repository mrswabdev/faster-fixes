"use server";

import { protectedProcedure } from "@/server/trpc/trpc";
import type { DiagnosticTrail } from "@fasterfixes/core";
import { inferProcedureOutput, TRPCError } from "@trpc/server";
import z from "zod";

// Dedicated lazy query for the Diagnostic Trail. Kept separate from the inbox
// `list` query so the (potentially ~64 KB) trail is fetched only when the
// dashboard modal opens, never for every feedback in the inbox.
export const getFeedbackDiagnostics = protectedProcedure
  .input(z.object({ projectId: z.string(), feedbackId: z.string() }))
  .query(async ({ input, ctx }) => {
    const { prisma, session } = ctx;

    const project = await prisma.project.findUnique({
      where: { id: input.projectId },
    });

    if (!project) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Projekt nicht gefunden." });
    }

    const membership = await prisma.member.findFirst({
      where: {
        organizationId: project.organizationId,
        userId: session.user.id,
      },
    });

    if (!membership) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Zugriff verweigert." });
    }

    const feedback = await prisma.feedback.findFirst({
      where: { id: input.feedbackId, projectId: input.projectId },
      select: { diagnosticTrail: true },
    });

    if (!feedback) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Feedback nicht gefunden.",
      });
    }

    return (feedback.diagnosticTrail ?? null) as DiagnosticTrail | null;
  });

export type GetFeedbackDiagnosticsOutput = inferProcedureOutput<
  typeof getFeedbackDiagnostics
>;
