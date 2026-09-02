"use client";

import { useTRPC } from "@/lib/trpc/trpc-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { GetJiraInstallationOutput } from "./get-jira-installation.trpc.query";

type JiraConnectedProps = {
  installation: NonNullable<GetJiraInstallationOutput>;
};

export function JiraConnected({ installation }: JiraConnectedProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const disconnectMutation = useMutation(
    trpc.authenticated.integrations.jira.disconnect.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:
            trpc.authenticated.integrations.jira.getInstallation.queryKey(),
        });
        toast.success("Jira-Verbindung getrennt.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const needsReconnect = installation.healthState === "reconnect_required";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <span className="font-medium">{installation.siteName}</span>
        <span className="text-muted-foreground text-sm">
          Verbunden
          {installation.installedByName
            ? ` von ${installation.installedByName}`
            : ""}{" "}
          am{" "}
          {new Date(installation.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>

      {needsReconnect ? (
        <div className="flex flex-col gap-2 rounded-md border border-destructive/50 p-3">
          <span className="text-sm font-medium text-destructive">
            Erneute Verbindung erforderlich
          </span>
          <span className="text-muted-foreground text-sm">
            Die Jira-Autorisierung ist nicht mehr gültig, vermutlich weil
            der autorisierende Nutzer den Zugriff verloren hat. Erneut
            verbinden, um die Synchronisierung fortzusetzen.
          </span>
          <Button size="sm" className="self-start" asChild>
            <a href="/api/jira/install">Erneut verbinden</a>
          </Button>
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <a href={installation.siteUrl} target="_blank" rel="noopener noreferrer">
            In Jira öffnen
            <ExternalLink className="ml-1 size-3" />
          </a>
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              Trennen
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Jira-Verbindung trennen?</AlertDialogTitle>
              <AlertDialogDescription>
                Dadurch wird die Verbindung entfernt und alle Projekte
                werden von dieser Jira-Site getrennt. Bestehende
                Jira-Issues werden nicht gelöscht.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction onClick={() => disconnectMutation.mutate()}>
                Trennen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
