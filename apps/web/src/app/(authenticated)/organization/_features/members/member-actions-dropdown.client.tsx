"use client";

import { useActiveOrganization } from "@/lib/auth";
import { useTRPC } from "@/lib/trpc/trpc-client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreHorizontal, Shield, UserMinus } from "lucide-react";
import { toast } from "sonner";
import type { UpdateMemberRoleInputs } from "./update-role/update-member-role.schema";

type MemberActionsDropdownProps = {
  memberId: string;
  memberRole: string;
  isOwner: boolean;
};

export function MemberActionsDropdown({
  memberId,
  memberRole,
  isOwner,
}: MemberActionsDropdownProps) {
  const trpc = useTRPC();
  const { refetch: refetchActiveOrg } = useActiveOrganization();

  const updateRole = useMutation(
    trpc.authenticated.organization.member.updateRole.mutationOptions({
      onSuccess: async () => {
        await refetchActiveOrg();
        toast.success("Rolle erfolgreich aktualisiert");
      },
      onError: (error) => {
        toast.error(error.message || "Fehler beim Ändern der Rolle.");
      },
    }),
  );

  const removeMember = useMutation(
    trpc.authenticated.organization.member.delete.mutationOptions({
      onSuccess: async () => {
        await refetchActiveOrg();
        toast.success("Mitglied erfolgreich entfernt");
      },
      onError: (error) => {
        toast.error(error.message || "Fehler beim Entfernen des Mitglieds.");
      },
    }),
  );

  const isPending = updateRole.isPending || removeMember.isPending;

  const handleUpdateRole = (newRole: UpdateMemberRoleInputs["role"]) => {
    updateRole.mutate({ memberId, role: newRole });
  };

  const handleRemoveMember = () => {
    removeMember.mutate({ memberId });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isOwner && memberRole !== "admin" && (
          <DropdownMenuItem onSelect={() => handleUpdateRole("admin")}>
            <Shield className="size-4" />
            Zum Admin befördern
          </DropdownMenuItem>
        )}
        {isOwner && memberRole === "admin" && (
          <DropdownMenuItem onSelect={() => handleUpdateRole("member")}>
            <Shield className="size-4" />
            Zum Mitglied herabstufen
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={handleRemoveMember} variant="destructive">
          <UserMinus className="size-4" />
          Mitglied entfernen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
