"use client";

import { useActiveOrganization } from "@/lib/auth";
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
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { ShieldOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { GetAgentTokensOutput } from "./get-agent-tokens.trpc.query";

type AgentTokenItemProps = {
  token: GetAgentTokensOutput[number];
};

function formatDate(date: Date | string | null): string {
  if (!date) return "Nie";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatScopes(scopes: string[]): string {
  return scopes
    .map((s) => {
      switch (s) {
        case "feedbacks:read":
          return "Lesen";
        case "feedbacks:update_status":
          return "Status aktualisieren";
        case "feedbacks:create":
          return "Erstellen";
        default:
          return s;
      }
    })
    .join(", ");
}

export function AgentTokenItem({ token }: AgentTokenItemProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: activeOrg } = useActiveOrganization();

  const invalidateTokens = () => {
    queryClient.invalidateQueries({
      queryKey: trpc.authenticated.integrations.agentToken.list.queryKey({
        organizationId: activeOrg?.id ?? "",
      }),
    });
  };

  const revokeToken = useMutation(
    trpc.authenticated.integrations.agentToken.revoke.mutationOptions({
      onSuccess: () => {
        invalidateTokens();
        toast.success("Token entzogen");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  const deleteToken = useMutation(
    trpc.authenticated.integrations.agentToken.delete.mutationOptions({
      onSuccess: () => {
        invalidateTokens();
        toast.success("Token gelöscht");
      },
      onError: (error) => toast.error(error.message),
    }),
  );

  if (!activeOrg?.id) return null;

  return (
    <div className="flex items-start gap-4 py-3">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate font-medium">{token.name}</span>
        <code className="text-muted-foreground text-xs">
          ff_agent_••••{token.tokenLastFour}
        </code>
        <div className="text-muted-foreground text-xs">
          {formatScopes(token.scopes)} · Zuletzt verwendet{" "}
          {formatDate(token.lastUsedAt)}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant={token.isActive ? "default" : "destructive"}>
          {token.isActive ? "Aktiv" : "Entzogen"}
        </Badge>

        <div className="flex shrink-0 gap-1">
          {token.isActive && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="size-8">
                  <ShieldOff className="size-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Token entziehen?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Dadurch wird der Token sofort ungültig. Jeder Agent, der
                    ihn verwendet, verliert den Zugriff.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() =>
                      revokeToken.mutate({
                        organizationId: activeOrg.id,
                        tokenId: token.id,
                      })
                    }
                    variant="destructive"
                  >
                    Entziehen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <Trash2 className="size-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Token löschen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Dadurch wird der Token endgültig gelöscht. Diese Aktion
                  kann nicht rückgängig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    deleteToken.mutate({
                      organizationId: activeOrg.id,
                      tokenId: token.id,
                    })
                  }
                  variant="destructive"
                >
                  Löschen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
