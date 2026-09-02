"use server";

import { auth } from "@/server/auth";
import { decryptSlackToken } from "@/server/slack/crypto";
import { listPublicChannels } from "@/server/slack/slack-client";
import { protectedProcedure } from "@/server/trpc/trpc";
import { TRPCError, inferProcedureOutput } from "@trpc/server";
import { headers } from "next/headers";

export const listSlackChannels = protectedProcedure.query(async ({ ctx }) => {
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
      message: "Nur Inhaber und Admins können Slack-Kanäle auflisten.",
    });
  }

  const installation = await prisma.slackInstallation.findUnique({
    where: { organizationId: activeOrganization.id },
    select: { botToken: true },
  });

  if (!installation) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Kein Slack-Workspace verbunden.",
    });
  }

  const botToken = decryptSlackToken(installation.botToken);
  return listPublicChannels(botToken);
});

export type ListSlackChannelsOutput = inferProcedureOutput<
  typeof listSlackChannels
>;
