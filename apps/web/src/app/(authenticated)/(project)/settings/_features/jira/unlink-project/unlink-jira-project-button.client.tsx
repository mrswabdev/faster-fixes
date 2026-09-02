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

type UnlinkJiraProjectButtonProps = {
  projectId: string;
};

export function UnlinkJiraProjectButton({
  projectId,
}: UnlinkJiraProjectButtonProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const unlinkMutation = useMutation(
    trpc.authenticated.projects.jira.unlinkProject.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.authenticated.projects.jira.getLink.queryKey({
            projectId,
          }),
        });
        toast.success("Jira-Projektverknüpfung aufgehoben.");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-fit">
          <Unlink className="size-3" />
          Jira-Projektverknüpfung aufheben
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Jira-Projektverknüpfung aufheben?</AlertDialogTitle>
          <AlertDialogDescription>
            Neues Feedback erstellt keine Jira-Issues mehr. Bestehende Issues
            werden nicht gelöscht, und die Organisation bleibt mit der
            Jira-Site verbunden.
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
