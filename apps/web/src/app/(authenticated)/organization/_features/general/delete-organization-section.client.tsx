"use client";

import { defaultRedirect } from "@/app/_constants/routes";
import { organization, useActiveOrganization } from "@/lib/auth";
import { useTRPC } from "@/lib/trpc/trpc-client";
import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { Button } from "@workspace/ui/components/button";
import { AlertTriangleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

export function DeleteOrganizationSection() {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: activeOrg } = useActiveOrganization();
  const [open, setOpen] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  const orgDetailsQuery = useQuery(
    trpc.authenticated.organization.get.queryOptions(
      { organizationId: activeOrg?.id ?? "" },
      { enabled: !!activeOrg?.id },
    ),
  );

  const isDefault = orgDetailsQuery.data?.isDefault ?? false;

  const handleDelete = async () => {
    if (!activeOrg) return;

    setIsPending(true);
    try {
      const result = await organization.delete({
        organizationId: activeOrg.id,
      });

      if (result.error) {
        toast.error(result.error.message || "Fehler beim Löschen der Organisation.");
        return;
      }

      toast.success("Organisation erfolgreich gelöscht");
      setOpen(false);
      router.push(defaultRedirect);
    } catch {
      toast.error("Ein unerwarteter Fehler ist aufgetreten.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Alert variant="destructive" className="max-w-sm">
        <AlertTriangleIcon />
        <AlertDescription>
          {isDefault
            ? "Die Standardorganisation kann nicht gelöscht werden."
            : "Das Löschen der Organisation ist unwiderruflich. Alle zugehörigen Daten gehen verloren."}
        </AlertDescription>
      </Alert>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="w-fit self-end"
            disabled={isDefault}
          >
            Organisation löschen
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <AlertTriangleIcon className="text-destructive h-5 w-5" />
              <AlertDialogTitle>Organisation löschen</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Diese Aktion ist unwiderruflich. Alle Daten der Organisation{" "}
              <strong>{activeOrg?.name}</strong> werden endgültig gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Abbrechen</AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              {isPending ? "Wird gelöscht..." : "Löschen bestätigen"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
