"use client";

import { useTRPC } from "@/lib/trpc/trpc-client";
import { useMutation } from "@tanstack/react-query";
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

type RequestPasswordResetButtonProps = {
  userId: string;
};

export const RequestPasswordResetButton = ({
  userId,
}: RequestPasswordResetButtonProps) => {
  const trpc = useTRPC();
  const requestPasswordResetMutation =
    useMutation(trpc.admin.users.password.requestReset.mutationOptions({
      onSuccess: () => {
        toast.success("Erfolg", {
          description:
            "Eine E-Mail zum Zurücksetzen des Passworts wurde an den Benutzer gesendet",
        });
      },
      onError: (error) => {
        toast.error("Fehler", {
          description:
            error.message ||
            "Link zum Zurücksetzen des Passworts konnte nicht gesendet werden",
        });
      },
    }));

  const handleRequestReset = () => {
    requestPasswordResetMutation.mutate({ userId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={requestPasswordResetMutation.isPending}
        >
          Passwort zurücksetzen
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
Link zum Zurücksetzen des Passworts senden?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Es wird eine E-Mail mit einem Link zum Zurücksetzen des Passworts an
            den Benutzer gesendet. Dieser kann anschließend ein neues Passwort
            festlegen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRequestReset}
            disabled={requestPasswordResetMutation.isPending}
          >
            {requestPasswordResetMutation.isPending
              ? "Wird gesendet..."
              : "Senden"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
