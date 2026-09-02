"use client";

import { Button } from "@workspace/ui/components/button";
import { SlackIcon } from "@workspace/ui/components/icons/slack-icon";

export function SlackNotConnected() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        Kein Slack-Workspace verbunden. Fügen Sie Faster Fixes zu Slack
        hinzu, um bei neuem oder geändertem Feedback benachrichtigt zu
        werden.
      </p>
      <Button asChild>
        <a href="/api/slack/install">
          <SlackIcon className="size-4" />
          Zu Slack hinzufügen
        </a>
      </Button>
    </div>
  );
}
