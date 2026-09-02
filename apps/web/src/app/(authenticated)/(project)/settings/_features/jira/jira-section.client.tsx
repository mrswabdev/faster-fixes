"use client";

import { usePlanGate } from "@/app/_features/subscription/use-plan-gate";
import { useActiveOrganization } from "@/lib/auth";
import { useTRPC } from "@/lib/trpc/trpc-client";
import { matchQueryStatus } from "@/utils/tanstack-query/match-query-status";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { JiraProjectPicker } from "./link-project/jira-project-picker.client";
import { LinkedJiraProjectView } from "./linked-jira-project-view.client";

type JiraSectionProps = {
  projectId: string;
};

export function JiraSection({ projectId }: JiraSectionProps) {
  const { data: activeOrg } = useActiveOrganization();
  const { canAccess } = usePlanGate();

  if (!canAccess("jiraIntegration")) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          Die Jira-Integration ist in kostenpflichtigen Tarifen verfügbar.
        </p>
        <Button className="w-fit" asChild>
          <a href="/account/billing">Tarif upgraden</a>
        </Button>
      </div>
    );
  }

  return <JiraSectionInner orgId={activeOrg?.id} projectId={projectId} />;
}

type JiraSectionInnerProps = {
  orgId: string | undefined;
  projectId: string;
};

function JiraSectionInner({ orgId, projectId }: JiraSectionInnerProps) {
  const trpc = useTRPC();

  const installationQuery = useQuery(
    trpc.authenticated.integrations.jira.getInstallation.queryOptions(
      undefined,
      { enabled: !!orgId },
    ),
  );

  return matchQueryStatus(installationQuery, {
    Loading: <Skeleton className="h-16 w-full" />,
    Errored: (
      <Alert variant="destructive">
        <AlertDescription>
          Jira-Integration konnte nicht geladen werden. Laden Sie die Seite
          neu.
        </AlertDescription>
      </Alert>
    ),
    Empty: (
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          Verbinden Sie eine Jira-Site in den Organisationseinstellungen, um
          ein Jira-Projekt zu verknüpfen.
        </p>
        <Button variant="link" className="w-fit px-0" asChild>
          <a href="/integrations">Zu den Integrationen</a>
        </Button>
      </div>
    ),
    Success: ({ data: installation }) =>
      // A site that was never finalized or lost its authorization cannot serve
      // the pickers, so send the maintainer back to the integrations page.
      installation.healthState === "connected" ? (
        <LinkOrPickJiraProject
          projectId={projectId}
          siteUrl={installation.siteUrl}
        />
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm">
            Die Jira-Verbindung erfordert eine Prüfung, bevor ein
            Jira-Projekt verknüpft werden kann.
          </p>
          <Button variant="link" className="w-fit px-0" asChild>
            <a href="/integrations">Zu den Integrationen</a>
          </Button>
        </div>
      ),
  });
}

type LinkOrPickJiraProjectProps = {
  projectId: string;
  siteUrl: string;
};

function LinkOrPickJiraProject({
  projectId,
  siteUrl,
}: LinkOrPickJiraProjectProps) {
  const trpc = useTRPC();

  const linkQuery = useQuery(
    trpc.authenticated.projects.jira.getLink.queryOptions({ projectId }),
  );

  const jiraProjectsQuery = useQuery(
    trpc.authenticated.projects.jira.listProjects.queryOptions(
      { projectId },
      { enabled: !linkQuery.data },
    ),
  );

  return matchQueryStatus(linkQuery, {
    Loading: <Skeleton className="h-32 w-full" />,
    Errored: (
      <Alert variant="destructive">
        <AlertDescription>
          Jira-Projektverknüpfung konnte nicht geladen werden. Laden Sie die
          Seite neu.
        </AlertDescription>
      </Alert>
    ),
    Success: ({ data: link }) =>
      link ? (
        <LinkedJiraProjectView
          projectId={projectId}
          link={link}
          siteUrl={siteUrl}
        />
      ) : (
        <JiraProjectPicker
          projectId={projectId}
          jiraProjects={jiraProjectsQuery.data ?? []}
        />
      ),
  });
}
