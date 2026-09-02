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
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

type DeleteReviewerButtonProps = {
  projectId: string;
  reviewerId: string;
  reviewerName: string;
};

export function DeleteReviewerButton({
  projectId,
  reviewerId,
  reviewerName,
}: DeleteReviewerButtonProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const deleteReviewer = useMutation(
    trpc.authenticated.projects.reviewer.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.authenticated.projects.reviewer.list.queryOptions({ projectId }),
        );
        toast.success("Reviewer gelöscht");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="size-4" />
          Löschen
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reviewer löschen</AlertDialogTitle>
          <AlertDialogDescription>
            Möchten Sie{" "}
            <span className="font-medium">{reviewerName}</span> wirklich
            endgültig löschen? Diese Aktion kann nicht rückgängig gemacht
            werden und das gesamte zugehörige Feedback geht verloren.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteReviewer.mutate({ reviewerId })}
            variant="destructive"
          >
            Löschen
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
