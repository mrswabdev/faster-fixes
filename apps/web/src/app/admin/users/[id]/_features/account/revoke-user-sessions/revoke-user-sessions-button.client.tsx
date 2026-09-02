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

type RevokeUserSessionsButtonProps = {
  userId: string;
};

export const RevokeUserSessionsButton = ({
  userId,
}: RevokeUserSessionsButtonProps) => {
  const trpc = useTRPC();
  const revokeSessionsMutation =
    useMutation(trpc.admin.users.sessions.revoke.mutationOptions({
      onSuccess: () => {
        toast.success("Erfolg", {
          description: "Alle Sitzungen des Benutzers wurden widerrufen",
        });
      },
      onError: (error) => {
        toast.error("Fehler", {
          description:
            error.message || "Sitzungen des Benutzers konnten nicht widerrufen werden",
        });
      },
    }));

  const handleRevoke = () => {
    revokeSessionsMutation.mutate({ userId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={revokeSessionsMutation.isPending}>
          Von allen Geräten abmelden
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
Benutzer von allen Geräten abmelden?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Dadurch wird der Benutzer aus allen aktiven Sitzungen auf allen
            Geräten abgemeldet. Er muss sich erneut anmelden, um wieder
            Zugriff auf sein Konto zu erhalten.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleRevoke}
            disabled={revokeSessionsMutation.isPending}
          >
            {revokeSessionsMutation.isPending
              ? "Wird abgemeldet..."
              : "Abmelden"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
