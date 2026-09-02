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

type UnlinkRepoButtonProps = {
  projectId: string;
};

export function UnlinkRepoButton({ projectId }: UnlinkRepoButtonProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const unlinkMutation = useMutation(
    trpc.authenticated.projects.github.unlinkRepo.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: trpc.authenticated.projects.github.getLink.queryKey({
            projectId,
          }),
        });
        toast.success("Repository-Verknüpfung aufgehoben.");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-fit">
          <Unlink className="size-3" />
          Repository-Verknüpfung aufheben
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Repository-Verknüpfung aufheben?</AlertDialogTitle>
          <AlertDialogDescription>
            Neues Feedback erstellt keine GitHub-Issues mehr. Bestehende
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
