"use client";

import { useTRPC } from "@/lib/trpc/trpc-client";
import { matchQueryStatus } from "@/utils/tanstack-query/match-query-status";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Label } from "@workspace/ui/components/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { useState } from "react";
import { toast } from "sonner";

// Shown when the OAuth grant covered several Jira sites. The user picks exactly
// one to store for the Organization before the integration is usable.
export function JiraSelectSite() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);

  const sitesQuery = useQuery(
    trpc.authenticated.integrations.jira.listAccessibleSites.queryOptions(),
  );

  const selectMutation = useMutation(
    trpc.authenticated.integrations.jira.selectSite.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey:
            trpc.authenticated.integrations.jira.getInstallation.queryKey(),
        });
        toast.success("Jira-Site verbunden.");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  return (
    <div className="flex flex-col gap-4">
      <p className="text-muted-foreground text-sm">
        Ihr Atlassian-Konto hat Zugriff auf mehrere Jira-Sites. Wählen Sie
        die, die mit dieser Organisation verbunden werden soll.
      </p>

      {matchQueryStatus(sitesQuery, {
        Loading: <Skeleton className="h-16 w-full" />,
        Errored: (
          <p className="text-destructive text-sm">
            Ihre Jira-Sites konnten nicht geladen werden. Laden Sie die
            Seite neu.
          </p>
        ),
        Empty: (
          <p className="text-muted-foreground text-sm">
            Keine zugänglichen Jira-Sites gefunden.
          </p>
        ),
        Success: ({ data: sites }) => (
          <>
            <RadioGroup
              value={selected ?? undefined}
              onValueChange={setSelected}
            >
              {sites.map((site) => (
                <div key={site.cloudId} className="flex items-center gap-3">
                  <RadioGroupItem value={site.cloudId} id={site.cloudId} />
                  <Label
                    htmlFor={site.cloudId}
                    className="flex flex-col items-start gap-0.5"
                  >
                    <span className="font-medium">{site.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {site.url}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <Button
              className="self-start"
              disabled={!selected || selectMutation.isPending}
              onClick={() =>
                selected && selectMutation.mutate({ cloudId: selected })
              }
            >
              Site verbinden
            </Button>
          </>
        ),
      })}
    </div>
  );
}
