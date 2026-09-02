"use client";

import { usePlanGate } from "@/app/_features/subscription/use-plan-gate";
import { useActiveOrganization } from "@/lib/auth";
import { useTRPC } from "@/lib/trpc/trpc-client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { RepoPicker } from "./link-repo/repo-picker.client";
import { LinkedRepoView } from "./linked-repo-view.client";

type GitHubSectionProps = {
  projectId: string;
};

export function GitHubSection({ projectId }: GitHubSectionProps) {
  const trpc = useTRPC();
  const { data: activeOrg } = useActiveOrganization();
  const { canAccess } = usePlanGate();

  const installationQuery = useQuery(
    trpc.authenticated.integrations.github.getInstallation.queryOptions(
      undefined,
      { enabled: !!activeOrg?.id },
    ),
  );

  const linkQuery = useQuery(
    trpc.authenticated.projects.github.getLink.queryOptions(
      { projectId },
      { enabled: !!projectId },
    ),
  );

  const reposQuery = useQuery(
    trpc.authenticated.projects.github.listRepos.queryOptions(undefined, {
      enabled: !!installationQuery.data && !linkQuery.data,
    }),
  );

  const installation = installationQuery.data;
  const link = linkQuery.data;
  const repos = reposQuery.data ?? [];

  if (!canAccess("githubIntegration")) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          Die GitHub-Integration ist in kostenpflichtigen Tarifen verfügbar.
        </p>
        <Button className="w-fit" asChild>
          <a href="/account/billing">Tarif upgraden</a>
        </Button>
      </div>
    );
  }

  if (!installation) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          Verbinden Sie GitHub in den Organisationseinstellungen, um die
          Issue-Erstellung zu aktivieren.
        </p>
        <Button variant="link" className="w-fit px-0" asChild>
          <a href="/integrations">Zu den Integrationen</a>
        </Button>
      </div>
    );
  }

  if (link) {
    return <LinkedRepoView projectId={projectId} link={link} />;
  }

  return <RepoPicker projectId={projectId} repos={repos} />;
}
