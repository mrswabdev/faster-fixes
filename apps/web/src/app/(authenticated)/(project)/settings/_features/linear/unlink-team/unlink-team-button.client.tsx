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
import { Unlink } from "lucide-react";
import { toast } from "sonner";

type UnlinkTeamButtonProps = {
  projectId: string;
};

export function UnlinkTeamButton({ projectId }: UnlinkTeamButtonProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const unlinkMutation = useMutation(
    trpc.authenticated.projects.linear.unlinkTeam.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.authenticated.projects.linear.getLink.queryKey({
            projectId,
          }),
        });
        toast.success("Team-Verknüpfung aufgehoben.");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-fit">
          <Unlink className="size-3" />
          Team-Verknüpfung aufheben
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Team-Verknüpfung aufheben?</AlertDialogTitle>
          <AlertDialogDescription>
            Neues Feedback erstellt keine Linear-Issues mehr. Bestehende
            Issues werden nicht gelöscht.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => unlinkMutation.mutate({ projectId })}
            variant="destructive"
          >
            Verknüpfung aufheben
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
