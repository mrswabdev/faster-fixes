import { auth } from "@/server/auth";
import { adminProcedure } from "@/server/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { headers } from "next/headers";
import { RevokeUserSessionsSchema } from "./revoke-user-sessions.schema";

export const revokeUserSessions = adminProcedure
  .input(RevokeUserSessionsSchema)
  .mutation(async ({ input }) => {
    const { userId } = input;

    try {
      // Verify user exists
      const user = await auth.api.getSession({
        headers: await headers(),
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Sitzung nicht gefunden",
        });
      }

      // Revoke all user sessions using better-auth admin API
      const result = await auth.api.revokeUserSessions({
        body: {
          userId,
        },
        headers: await headers(),
      });

      if (!result) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Sitzungen des Benutzers konnten nicht widerrufen werden",
        });
      }

      return { success: true };
    } catch (error) {
      // Handle better-auth specific errors
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error ? error.message : "Sitzungen konnten nicht widerrufen werden",
      });
    }
  });
