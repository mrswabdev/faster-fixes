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
import type { GetLinearInstallationOutput } from "./get-linear-installation.trpc.query";

type LinearConnectedProps = {
  installation: NonNullable<GetLinearInstallationOutput>;
};

export function LinearConnected({ installation }: LinearConnectedProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const disconnectMutation = useMutation(
    trpc.authenticated.integrations.linear.disconnect.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:
            trpc.authenticated.integrations.linear.getInstallation.queryKey(),
        });
        toast.success("Linear-Verbindung getrennt.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col">
        <span className="font-medium">{installation.linearOrgName}</span>
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
        <Button variant="outline" size="sm" asChild>
          <a
            href={`https://linear.app/${installation.linearOrgUrlKey}/settings/api/applications`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Auf Linear verwalten
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
              <AlertDialogTitle>Linear-Verbindung trennen?</AlertDialogTitle>
              <AlertDialogDescription>
                Dadurch wird die Verbindung entfernt und alle Teams werden
                von Ihren Projekten getrennt. Bestehende Linear-Issues
                werden nicht gelöscht.
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
