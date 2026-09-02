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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import type { GetGitHubInstallationOutput } from "./get-github-installation.trpc.query";

type GitHubConnectedProps = {
  installation: NonNullable<GetGitHubInstallationOutput>;
};

export function GitHubConnected({ installation }: GitHubConnectedProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const disconnectMutation = useMutation(
    trpc.authenticated.integrations.github.disconnect.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:
            trpc.authenticated.integrations.github.getInstallation.queryKey(),
        });
        toast.success("GitHub-Verbindung getrennt.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage
            src={installation.accountAvatarUrl ?? undefined}
            alt={installation.accountLogin}
          />
          <AvatarFallback>
            {installation.accountLogin.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-medium">{installation.accountLogin}</span>
            <Badge variant="secondary">{installation.accountType}</Badge>
          </div>
          <span className="text-muted-foreground text-sm">
            Verbunden{installation.installedByName ? ` von ${installation.installedByName}` : ""} am{" "}
            {new Date(installation.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" asChild>
          <a
            href={`https://github.com/settings/installations/${installation.installationId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Auf GitHub verwalten
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
              <AlertDialogTitle>GitHub-Verbindung trennen?</AlertDialogTitle>
              <AlertDialogDescription>
                Dadurch wird die Verbindung entfernt und alle Repositories
                werden von Ihren Projekten getrennt. Bestehende
                GitHub-Issues werden nicht gelöscht.
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
