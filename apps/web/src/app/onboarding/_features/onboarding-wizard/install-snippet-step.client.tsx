"use client";

import { Button } from "@workspace/ui/components/button";
import { CopyButton } from "@workspace/ui/components/copy-button";
import { ArrowRight } from "lucide-react";

type InstallSnippetStepProps = {
  projectId: string;
  onNext: () => void;
};

function buildSnippet(projectId: string) {
  return `import { FeedbackProvider } from "@fasterfixes/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        <FeedbackProvider projectId="${projectId}">
          {children}
        </FeedbackProvider>
      </body>
    </html>
  );
}`;
}

export function InstallSnippetStep({
  projectId,
  onNext,
}: InstallSnippetStepProps) {
  const snippet = buildSnippet(projectId);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Widget installieren</h1>
        <p className="text-muted-foreground text-sm">
          Fügen Sie das Feedback-Widget zu Ihrer React-Anwendung hinzu. Ihre Projekt-ID
          ist bereits im untenstehenden Code-Snippet enthalten.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium">1. Paket installieren</p>
          <div className="bg-muted relative rounded-md border p-3">
            <code className="font-mono text-sm">
              npm install @fasterfixes/react
            </code>
            <CopyButton
              content="npm install @fasterfixes/react"
              variant="ghost"
              size="icon-xs"
              className="absolute top-2 right-2"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium">2. App mit dem Provider umschließen</p>
          <div className="bg-muted relative rounded-md border p-3">
            <pre className="overflow-x-auto font-mono text-sm leading-relaxed">
              <code>{snippet}</code>
            </pre>
            <CopyButton
              content={snippet}
              variant="ghost"
              size="icon-xs"
              className="absolute top-2 right-2"
            />
          </div>
        </div>
      </div>

      <Button onClick={onNext} className="self-end">
        Fertig
        <ArrowRight className="size-4" />
      </Button>
    </div>
  );
}
