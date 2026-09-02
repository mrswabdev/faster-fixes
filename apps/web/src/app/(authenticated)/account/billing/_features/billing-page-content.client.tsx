"use client";

import { DashboardPageContent } from "@/app/_features/core/dashboard/dashboard-page-content";
import { PlanSelection } from "@/app/_features/subscription/upgrade-subscription/plan-selection.client";
import { usePlanGate } from "@/app/_features/subscription/use-plan-gate";
import { CurrentPlanCard } from "./current-plan/current-plan-card.client";
import { PastInvoicesCard } from "./past-invoices/past-invoices-card.client";
import { SubscriptionStatusBanner } from "./subscription-status/subscription-status-banner.client";

interface BillingPageContentProps {
  organizationId: string;
}

export function BillingPageContent({
  organizationId,
}: BillingPageContentProps) {
  const { isFreePlan } = usePlanGate();

  if (isFreePlan) {
    return (
      <DashboardPageContent
        title="Abonnieren"
        breadcrumbs={[{ label: "Mein Konto" }, { label: "Abonnieren" }]}
      >
        <p className="text-muted-foreground mb-6">
          Wählen Sie den Plan, der am besten zu Ihren Anforderungen passt.
        </p>
        <div className="max-w-3xl">
          <PlanSelection />
        </div>
      </DashboardPageContent>
    );
  }

  return (
    <DashboardPageContent
      title="Abrechnung"
      breadcrumbs={[{ label: "Mein Konto" }, { label: "Abrechnung" }]}
    >
      <SubscriptionStatusBanner />

      <div className="mt-4">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="lg:w-3/5">
            <CurrentPlanCard organizationId={organizationId} />
          </div>

          <div className="lg:w-2/5">
            <PastInvoicesCard />
          </div>
        </div>
      </div>
    </DashboardPageContent>
  );
}
