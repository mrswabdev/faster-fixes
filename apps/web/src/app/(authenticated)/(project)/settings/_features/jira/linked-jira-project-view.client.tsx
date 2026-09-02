"use client";

import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { ExternalLink } from "lucide-react";
import type { GetProjectJiraLinkOutput } from "./get-project-jira-link.trpc.query";
import { UnlinkJiraProjectButton } from "./unlink-project/unlink-jira-project-button.client";
import { AutoCreateIssuesSwitch } from "./update-link/auto-create-issues-switch.client";
import { DefaultLabelsEditor } from "./update-link/default-labels-editor.client";

// Keyed on ProjectJiraLink.linkHealthIssue. Each reason gets its own copy because
// the remedy differs: drift needs the link re-picked, a failed webhook refresh
// clears itself on the next weekly run.
const LINK_HEALTH_MESSAGES: Record<string, string> = {
  stale_project:
    "Das verknüpfte Jira-Projekt ist nicht mehr erreichbar. Verknüpfung aufheben und erneut auswählen, um wieder Issues zu erstellen.",
  stale_issue_type:
    "Jira hat den Issue-Typ für diese Verknüpfung abgelehnt, meist weil ein Pflichtfeld hinzugekommen ist. Verknüpfung aufheben und den Issue-Typ erneut auswählen.",
  webhook_refresh_failed:
    "Faster Fixes konnte den Jira-Webhook dieser Verknüpfung nicht erneuern, daher werden Statusänderungen aus Jira nicht zurücksynchronisiert. Es wird wöchentlich erneut versucht; Verknüpfung aufheben und neu verknüpfen, um es sofort zu beheben.",
};

const FALLBACK_LINK_HEALTH_MESSAGE =
  "Diese Verknüpfung erfordert eine Prüfung. Verknüpfung aufheben und das Jira-Projekt erneut auswählen, um diese Warnung zu entfernen.";

type LinkedJiraProjectViewProps = {
  projectId: string;
  link: NonNullable<GetProjectJiraLinkOutput>;
  siteUrl: string;
};

export function LinkedJiraProjectView({
  projectId,
  link,
  siteUrl,
}: LinkedJiraProjectViewProps) {
  return (
    <div className="flex flex-col gap-4">
      {link.linkHealthIssue && (
        <Alert variant="destructive">
          <AlertDescription>
            {LINK_HEALTH_MESSAGES[link.linkHealthIssue] ??
              FALLBACK_LINK_HEALTH_MESSAGE}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-1">
        <a
          href={`${siteUrl.replace(/\/$/, "")}/browse/${link.jiraProjectKey}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:underline"
        >
          {link.jiraProjectKey} · {link.jiraProjectName}
          <ExternalLink className="ml-1 inline size-3" />
        </a>
        <p className="text-muted-foreground text-sm">
          Issue-Typ: {link.issueTypeName}
        </p>
      </div>

      <AutoCreateIssuesSwitch
        projectId={projectId}
        checked={link.autoCreateIssues}
      />

      <DefaultLabelsEditor projectId={projectId} labels={link.defaultLabels} />

      <UnlinkJiraProjectButton projectId={projectId} />
    </div>
  );
}
