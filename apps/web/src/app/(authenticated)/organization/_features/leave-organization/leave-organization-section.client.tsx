"use client";

import { defaultRedirect } from "@/app/_constants/routes";
import {
  organization,
  useActiveOrganization,
  useListOrganizations,
} from "@/lib/auth";
import { useTRPC } from "@/lib/trpc/trpc-client";
import { useMutation } from "@tanstack/react-query";
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
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

export function LeaveOrganizationSection() {
  const trpc = useTRPC();
  const router = useRouter();
  const { data: activeOrg } = useActiveOrganization();
  const { refetch: refetchOrganizations } = useListOrganizations();
  const [open, setOpen] = React.useState(false);

  const leaveOrganization = useMutation(
    trpc.authenticated.organization.leave.mutationOptions({
      onSuccess: async () => {
        toast.success("Sie haben die Organisation verlassen");
        setOpen(false);
        await refetchOrganizations();
        const { data: orgs } = await organization.list();
        const firstOrg = orgs?.[0];
        if (firstOrg) {
          await organization.setActive({ organizationId: firstOrg.id });
        }
        router.push(defaultRedirect);
      },
      onError: (error) => {
        toast.error(error.message || "Fehler beim Verlassen der Organisation.");
      },
    }),
  );

  return (
    <div className="flex flex-col gap-4">
      <Alert variant="destructive" className="max-w-sm">
        <LogOut />
        <AlertDescription>
          Wenn Sie die Organisation verlassen, verlieren Sie den Zugriff auf
          alle zugehörigen Ressourcen und Daten.
        </AlertDescription>
      </Alert>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="w-fit self-end">
            Organisation verlassen
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <LogOut className="text-destructive h-5 w-5" />
              <AlertDialogTitle>Organisation verlassen</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="pt-2">
              Sie sind dabei, die Organisation{" "}
              <strong>{activeOrg?.name}</strong> zu verlassen. Sie haben
              danach keinen Zugriff mehr auf ihre Ressourcen.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={leaveOrganization.isPending}>
              Abbrechen
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={leaveOrganization.isPending}
              onClick={() => {
                if (!activeOrg) return;
                leaveOrganization.mutate({
                  organizationId: activeOrg.id,
                });
              }}
            >
              {leaveOrganization.isPending ? "Wird verlassen..." : "Verlassen bestätigen"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
