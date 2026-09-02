"use client";

import { useSession } from "@/lib/auth";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ImpersonateUserButtonProps = {
  userId: string;
  userEmail: string;
};

export const ImpersonateUserButton = ({
  userId,
  userEmail,
}: ImpersonateUserButtonProps) => {
  const trpc = useTRPC();
  const router = useRouter();
  const { refetch: refetchSession } = useSession();

  const impersonateUserMutation =
    useMutation(trpc.admin.users.impersonate.mutationOptions({
      onSuccess: async () => {
        toast.success("Erfolg", {
          description: `Sie sind jetzt als ${userEmail} angemeldet`,
        });
        await refetchSession();
        router.push("/");
      },
      onError: (error) => {
        toast.error("Fehler", {
          description:
            error.message ||
            "Anmeldung als dieser Benutzer fehlgeschlagen",
        });
      },
    }));

  const handleImpersonate = () => {
    impersonateUserMutation.mutate({ userId });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={impersonateUserMutation.isPending}>
          Als Benutzer anmelden
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
Sind Sie sicher, dass Sie sich als dieser Benutzer anmelden möchten?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Sie werden als {userEmail} angemeldet. Sie können die Anwendung
            dann als dieser Benutzer nutzen.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Abbrechen</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleImpersonate}
            disabled={impersonateUserMutation.isPending}
          >
            {impersonateUserMutation.isPending
              ? "Wird angemeldet..."
              : "Als Benutzer anmelden"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
