"use client";

import { Button } from "@workspace/ui/components/button";
import { LinearIcon } from "@workspace/ui/components/icons/linear-icon";

export function LinearNotConnected() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        Kein Linear-Workspace verbunden. Autorisieren Sie Faster Fixes, um
        Feedback mit bidirektionaler Statussynchronisierung als Issues in
        Linear zu spiegeln.
      </p>
      <Button asChild>
        <a href="/api/linear/install">
          <LinearIcon className="size-4" />
          Mit Linear verbinden
        </a>
      </Button>
    </div>
  );
}
