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
import { toast } from "sonner";
import type { GetSlackInstallationOutput } from "./get-slack-installation.trpc.query";

type SlackConnectedProps = {
  installation: NonNullable<GetSlackInstallationOutput>;
};

export function SlackConnected({ installation }: SlackConnectedProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const disconnectMutation = useMutation(
    trpc.authenticated.integrations.slack.disconnect.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:
            trpc.authenticated.integrations.slack.getInstallation.queryKey(),
        });
        toast.success("Slack-Verbindung getrennt.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <span className="font-medium">{installation.teamName}</span>
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

      <div className="flex gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              Trennen
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Slack-Verbindung trennen?</AlertDialogTitle>
              <AlertDialogDescription>
                Dadurch wird die Verbindung entfernt und alle
                Slack-Benachrichtigungen werden gestoppt. Bestehende
                Nachrichten in Slack werden nicht gelöscht.
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
