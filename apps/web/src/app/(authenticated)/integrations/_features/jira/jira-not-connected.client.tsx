"use client";

import { Button } from "@workspace/ui/components/button";
import { JiraIcon } from "@workspace/ui/components/icons/jira-icon";

export function JiraNotConnected() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        Keine Jira-Site verbunden. Autorisieren Sie Faster Fixes, um
        Feedback mit bidirektionaler Statussynchronisierung als Issues in
        Jira zu spiegeln.
      </p>
      <p className="text-muted-foreground text-sm">
        Autorisieren Sie mit einem Service-Account statt einem persönlichen
        Konto. Jira-Issues werden dem autorisierenden Nutzer zugeordnet, und
        die Verbindung bricht ab, wenn dieser Nutzer den Jira-Zugriff
        verliert.
      </p>
      <Button asChild>
        <a href="/api/jira/install">
          <JiraIcon className="size-4" />
          Mit Jira verbinden
        </a>
      </Button>
    </div>
  );
}
