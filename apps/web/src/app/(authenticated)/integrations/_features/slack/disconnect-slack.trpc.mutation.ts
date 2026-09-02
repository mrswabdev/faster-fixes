"use server";

import { auth } from "@/server/auth";
import { protectedProcedure } from "@/server/trpc/trpc";
import { TRPCError, inferProcedureOutput } from "@trpc/server";
import { headers } from "next/headers";

export const disconnectSlack = protectedProcedure.mutation(async ({ ctx }) => {
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
      role: { in: ["owner", "admin"] },
    },
  });

  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Nur Inhaber und Admins können Slack trennen.",
    });
  }

  // Deleting the installation cascades to project links and feedback messages.
  await prisma.slackInstallation.deleteMany({
    where: { organizationId: activeOrganization.id },
  });

  return { success: true };
});

export type DisconnectSlackOutput = inferProcedureOutput<
  typeof disconnectSlack
>;
