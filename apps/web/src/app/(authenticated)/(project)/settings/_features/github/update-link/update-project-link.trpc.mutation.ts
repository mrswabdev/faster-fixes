"use server";

import { enforceFeature } from "@/server/trpc/middlewares/enforce-feature";
import { planAwareProcedure } from "@/server/trpc/middlewares/with-plan-context";
import { TRPCError, inferProcedureOutput } from "@trpc/server";
import { UpdateProjectLinkSchema } from "./update-project-link.schema";

export const updateProjectLink = planAwareProcedure
  .use(enforceFeature("githubIntegration"))
  .input(UpdateProjectLinkSchema)
  .mutation(async ({ input, ctx }) => {
    const { prisma, session } = ctx;

    const link = await prisma.projectGitHubLink.findUnique({
      where: { projectId: input.projectId },
      include: { project: { select: { organizationId: true } } },
    });

    if (!link) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Keine GitHub-Verknüpfung für dieses Projekt gefunden.",
      });
    }

    const membership = await prisma.member.findFirst({
      where: {
        organizationId: link.project.organizationId,
        userId: session.user.id,
        role: { in: ["owner", "admin"] },
      },
    });

    if (!membership) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Nur Inhaber und Admins können Repository-Einstellungen aktualisieren.",
      });
    }

    await prisma.projectGitHubLink.update({
      where: { projectId: input.projectId },
      data: {
        ...(input.autoCreateIssues !== undefined && {
          autoCreateIssues: input.autoCreateIssues,
        }),
        ...(input.defaultLabels !== undefined && {
          defaultLabels: input.defaultLabels,
        }),
      },
    });

    return { success: true };
  });

export type UpdateProjectLinkOutput = inferProcedureOutput<
  typeof updateProjectLink
>;
