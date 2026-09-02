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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type DeleteUserButtonProps = {
  userId: string;
};

export const DeleteUserButton = ({ userId }: DeleteUserButtonProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation(trpc.admin.users.delete.mutationOptions({
    onSuccess: () => {
      toast.success("Erfolg", {
        description: "Benutzer erfolgreich gelöscht",
      });
      queryClient.invalidateQueries(trpc.admin.users.list.queryFilter());
      router.push("/admin/users");
    },
    onError: (error) => {
      toast.error("Fehler", {
        description: error.message || "Ein Fehler ist aufgetreten",
      });
    },
  }));

  const handleDelete = () => {
    deleteUserMutation.mutate({ userId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          disabled={deleteUserMutation.isPending}
        >
          Konto löschen
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Diese Aktion ist unwiderruflich. Sie löscht das Benutzerkonto und
            alle zugehörigen Daten von unseren Servern.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteUserMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteUserMutation.isPending ? "Wird gelöscht..." : "Löschen"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
