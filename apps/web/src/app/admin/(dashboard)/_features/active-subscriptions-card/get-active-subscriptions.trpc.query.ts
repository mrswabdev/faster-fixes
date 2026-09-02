import {
  SubscriptionPlanName,
  SubscriptionStatus,
} from "@/server/auth/config/subscription-plans";
import { adminProcedure } from "@/server/trpc/trpc";
import { inferProcedureOutput, TRPCError } from "@trpc/server";
import { prisma } from "@workspace/db";
import { getMonthlyChurnRate } from "../../_utils/get-churn-rate";

export const getActiveSubscriptions = adminProcedure.query(async () => {
  try {
    const activeOrTrialingStatus = [
      SubscriptionStatus.Active,
      SubscriptionStatus.Trialing,
    ];

    // better-auth/stripe stores `plan` as the plan name ("pro"/"agency"),
    // so filtering must use SubscriptionPlanName, not internal codenames.
    const [totalCount, proCount, agencyCount, userCount, churnRate] =
      await Promise.all([
        prisma.subscription.count({
          where: { status: { in: activeOrTrialingStatus } },
        }),
        prisma.subscription.count({
          where: {
            status: { in: activeOrTrialingStatus },
            plan: SubscriptionPlanName.Pro,
          },
        }),
        prisma.subscription.count({
          where: {
            status: { in: activeOrTrialingStatus },
            plan: SubscriptionPlanName.Agency,
          },
        }),
        prisma.user.count(),
        getMonthlyChurnRate(),
      ]);

    const conversionRate =
      userCount > 0 ? Math.round((totalCount / userCount) * 100) : 0;

    return {
      totalCount,
      proCount,
      agencyCount,
      userCount,
      conversionRate,
      churnRate,
      proPercentage:
        totalCount > 0 ? Math.round((proCount / totalCount) * 100) : 0,
      agencyPercentage:
        totalCount > 0 ? Math.round((agencyCount / totalCount) * 100) : 0,
    };
  } catch (error) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Aktive Abonnements konnten nicht geladen werden",
      cause: error,
    });
  }
});

export type GetActiveSubscriptionsOutput = inferProcedureOutput<
  typeof getActiveSubscriptions
>;
