"use client";

import { usePlanGate } from "@/app/_features/subscription/use-plan-gate";
import { useActiveOrganization } from "@/lib/auth";
import { useTRPC } from "@/lib/trpc/trpc-client";
import { matchQueryStatus } from "@/utils/tanstack-query/match-query-status";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { TeamPicker } from "./link-team/team-picker.client";
import { LinkedTeamView } from "./linked-team-view.client";

type LinearSectionProps = {
  projectId: string;
};

export function LinearSection({ projectId }: LinearSectionProps) {
  const { data: activeOrg } = useActiveOrganization();
  const { canAccess } = usePlanGate();

  if (!canAccess("linearIntegration")) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          Die Linear-Integration ist in kostenpflichtigen Tarifen verfügbar.
        </p>
        <Button className="w-fit" asChild>
          <a href="/account/billing">Tarif upgraden</a>
        </Button>
      </div>
    );
  }

  return (
    <LinearSectionInner orgId={activeOrg?.id} projectId={projectId} />
  );
}

type LinearSectionInnerProps = {
  orgId: string | undefined;
  projectId: string;
};

function LinearSectionInner({ orgId, projectId }: LinearSectionInnerProps) {
  const trpc = useTRPC();

  const installationQuery = useQuery(
    trpc.authenticated.integrations.linear.getInstallation.queryOptions(
      undefined,
      { enabled: !!orgId },
    ),
  );

  return matchQueryStatus(installationQuery, {
    Loading: <Skeleton className="h-16 w-full" />,
    Errored: (
      <Alert variant="destructive">
        <AlertDescription>
          Linear-Integration konnte nicht geladen werden. Laden Sie die
          Seite neu.
        </AlertDescription>
      </Alert>
    ),
    Empty: (
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          Verbinden Sie Linear in den Organisationseinstellungen, um ein
          Team zu verknüpfen.
        </p>
        <Button variant="link" className="w-fit px-0" asChild>
          <a href="/integrations">Zu den Integrationen</a>
        </Button>
      </div>
    ),
    Success: ({ data: installation }) => (
      <LinkOrPickTeam
        projectId={projectId}
        workspaceUrlKey={installation.linearOrgUrlKey}
      />
    ),
  });
}

type LinkOrPickTeamProps = {
  projectId: string;
  workspaceUrlKey: string;
};

function LinkOrPickTeam({ projectId, workspaceUrlKey }: LinkOrPickTeamProps) {
  const trpc = useTRPC();

  const linkQuery = useQuery(
    trpc.authenticated.projects.linear.getLink.queryOptions({ projectId }),
  );

  const teamsQuery = useQuery(
    trpc.authenticated.projects.linear.listTeams.queryOptions(undefined, {
      enabled: !linkQuery.data,
    }),
  );

  return matchQueryStatus(linkQuery, {
    Loading: <Skeleton className="h-32 w-full" />,
    Errored: (
      <Alert variant="destructive">
        <AlertDescription>
          Linear-Team-Verknüpfung konnte nicht geladen werden. Laden Sie
          die Seite neu.
        </AlertDescription>
      </Alert>
    ),
    Success: ({ data: link }) =>
      link ? (
        <LinkedTeamView
          projectId={projectId}
          link={link}
          workspaceUrlKey={workspaceUrlKey}
        />
      ) : (
        <TeamPicker projectId={projectId} teams={teamsQuery.data ?? []} />
      ),
  });
}
