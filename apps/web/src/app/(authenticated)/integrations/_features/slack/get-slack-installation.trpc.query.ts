"use server";

import { auth } from "@/server/auth";
import { protectedProcedure } from "@/server/trpc/trpc";
import { TRPCError, inferProcedureOutput } from "@trpc/server";
import { headers } from "next/headers";

export const getSlackInstallation = protectedProcedure.query(async ({ ctx }) => {
  const { prisma, session } = ctx;

  const activeOrganization = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  if (!activeOrganization) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Keine aktive Organisation.",
    });
  }

  const membership = await prisma.member.findFirst({
    where: {
      organizationId: activeOrganization.id,
      userId: session.user.id,
    },
  });

  if (!membership) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Zugriff verweigert." });
  }

  const installation = await prisma.slackInstallation.findUnique({
    where: { organizationId: activeOrganization.id },
    include: {
      installedBy: { include: { user: { select: { name: true } } } },
    },
  });

  if (!installation) return null;

  // The active project is the org's first project, matching how the rest of the
  // integration features resolve the current project.
  const activeProject = await prisma.project.findFirst({
    where: { organizationId: activeOrganization.id },
    orderBy: { createdAt: "asc" },
  });

  const projectLink = activeProject
    ? await prisma.projectSlackLink.findUnique({
        where: { projectId: activeProject.id },
        select: {
          channelId: true,
          channelName: true,
          enabled: true,
          linkHealthy: true,
          healthIssue: true,
        },
      })
    : null;

  return {
    id: installation.id,
    teamName: installation.slackTeamName,
    installedByName: installation.installedBy?.user.name ?? null,
    createdAt: installation.createdAt,
    projectLink,
  };
});

export type GetSlackInstallationOutput = inferProcedureOutput<
  typeof getSlackInstallation
>;
