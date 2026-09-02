"use client";

import { usePlanGate } from "@/app/_features/subscription/use-plan-gate";
import { useActiveOrganization } from "@/lib/auth";
import { useTRPC } from "@/lib/trpc/trpc-client";
import { matchQueryStatus } from "@/utils/tanstack-query/match-query-status";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ChannelPicker } from "./link-channel/channel-picker.client";
import { SlackEnabledSwitch } from "./update-link/slack-enabled-switch.client";

type SlackSectionProps = {
  projectId: string;
};

export function SlackSection({ projectId }: SlackSectionProps) {
  const { data: activeOrg } = useActiveOrganization();
  const { canAccess } = usePlanGate();

  if (!canAccess("slackIntegration")) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          Die Slack-Integration ist in kostenpflichtigen Tarifen verfügbar.
        </p>
        <Button className="w-fit" asChild>
          <a href="/account/billing">Tarif upgraden</a>
        </Button>
      </div>
    );
  }

  return <SlackSectionInner orgId={activeOrg?.id} projectId={projectId} />;
}

type SlackSectionInnerProps = {
  orgId: string | undefined;
  projectId: string;
};

function SlackSectionInner({ orgId, projectId }: SlackSectionInnerProps) {
  const trpc = useTRPC();

  const installationQuery = useQuery(
    trpc.authenticated.integrations.slack.getInstallation.queryOptions(
      undefined,
      { enabled: !!orgId },
    ),
  );

  return matchQueryStatus(installationQuery, {
    Loading: <Skeleton className="h-16 w-full" />,
    Errored: (
      <Alert variant="destructive">
        <AlertDescription>
          Slack-Integration konnte nicht geladen werden. Laden Sie die
          Seite neu.
        </AlertDescription>
      </Alert>
    ),
    Empty: (
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          Verbinden Sie Slack in den Organisationseinstellungen, um einen
          Channel auszuwählen.
        </p>
        <Button variant="link" className="w-fit px-0" asChild>
          <a href="/integrations">Zu den Integrationen</a>
        </Button>
      </div>
    ),
    Success: () => <PickChannel projectId={projectId} />,
  });
}

type PickChannelProps = {
  projectId: string;
};

function PickChannel({ projectId }: PickChannelProps) {
  const trpc = useTRPC();

  const linkQuery = useQuery(
    trpc.authenticated.projects.slack.getLink.queryOptions({ projectId }),
  );

  const channelsQuery = useQuery(
    trpc.authenticated.projects.slack.listChannels.queryOptions(),
  );

  return matchQueryStatus(linkQuery, {
    Loading: <Skeleton className="h-32 w-full" />,
    Errored: (
      <Alert variant="destructive">
        <AlertDescription>
          Slack-Channel-Verknüpfung konnte nicht geladen werden. Laden Sie
          die Seite neu.
        </AlertDescription>
      </Alert>
    ),
    Success: ({ data: link }) =>
      matchQueryStatus(channelsQuery, {
        Loading: <Skeleton className="h-32 w-full" />,
        Errored: (
          <Alert variant="destructive">
            <AlertDescription>
              Slack-Channels konnten nicht geladen werden. Laden Sie die
              Seite neu.
            </AlertDescription>
          </Alert>
        ),
        Empty: (
          <p className="text-muted-foreground text-sm">
            Keine Channels verfügbar. Laden Sie den Bot zunächst in einen
            Channel in Slack ein.
          </p>
        ),
        Success: ({ data: channels }) => (
          <div className="flex flex-col gap-4">
            <ChannelPicker
              projectId={projectId}
              channels={channels}
              selectedChannelId={link?.channelId ?? ""}
            />
            {link ? (
              <SlackEnabledSwitch projectId={projectId} checked={link.enabled} />
            ) : null}
          </div>
        ),
      }),
  });
}
