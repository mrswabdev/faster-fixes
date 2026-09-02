"use server";

import { protectedProcedure } from "@/server/trpc/trpc";
import { inferProcedureOutput, TRPCError } from "@trpc/server";
import z from "zod";

export const deleteAgentToken = protectedProcedure
  .input(z.object({ organizationId: z.string(), tokenId: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const { prisma, session } = ctx;

    const membership = await prisma.member.findFirst({
      where: {
        organizationId: input.organizationId,
        userId: session.user.id,
        role: { in: ["owner", "admin"] },
      },
    });

    if (!membership) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Zugriff verweigert." });
    }

    const token = await prisma.agentToken.findFirst({
      where: { id: input.tokenId, organizationId: input.organizationId },
    });

    if (!token) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Token nicht gefunden." });
    }

    await prisma.agentToken.delete({ where: { id: input.tokenId } });

    return { id: input.tokenId };
  });

export type DeleteAgentTokenOutput = inferProcedureOutput<
  typeof deleteAgentToken
>;
