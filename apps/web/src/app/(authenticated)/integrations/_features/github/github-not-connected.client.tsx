"use client";

import { Button } from "@workspace/ui/components/button";
import { GithubIcon } from "@workspace/ui/components/icons/github-icon";

export function GitHubNotConnected() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        Kein GitHub-Konto verbunden. Installieren Sie die Faster Fixes
        GitHub App, um die automatische Issue-Erstellung aus Feedback zu
        aktivieren.
      </p>
      <Button asChild>
        <a
          href={`https://github.com/apps/${process.env.NEXT_PUBLIC_GITHUB_APP_NAME}/installations/new`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon className="size-4" />
          Mit GitHub verbinden
        </a>
      </Button>
    </div>
  );
}
