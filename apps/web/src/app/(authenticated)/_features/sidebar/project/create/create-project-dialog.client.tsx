"use client";

import { useActiveProject } from "@/app/_features/project/active-project-provider.client";
import { useActiveOrganization } from "@/lib/auth";
import { useTRPC } from "@/lib/trpc/trpc-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Check, Copy, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import {
  CreateProjectInputs,
  CreateProjectSchema,
} from "./create-project.schema";

type CreateProjectDialogProps = {
  children?: React.ReactNode;
};

export function CreateProjectDialog({ children }: CreateProjectDialogProps) {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: activeOrg } = useActiveOrganization();
  const { setActiveProject } = useActiveProject();

  const [open, setOpen] = React.useState(false);
  const [createdProjectId, setCreatedProjectId] = React.useState<string | null>(
    null,
  );
  const [copied, setCopied] = React.useState(false);

  const form = useForm<CreateProjectInputs>({
    resolver: zodResolver(CreateProjectSchema),
    defaultValues: {
      organizationId: activeOrg?.id ?? "",
      name: "",
      domain: "",
    },
  });

  const createProject = useMutation(
    trpc.authenticated.projects.create.mutationOptions({
      onSuccess: async (result) => {
        setOpen(false);
        setCreatedProjectId(result.publicId);
        await queryClient.invalidateQueries({
          queryKey: trpc.authenticated.projects.list.queryKey(),
        });
        setActiveProject(result.id);
      },
      onError: (error) => {
        form.setError("root", {
          message: error.message || "Fehler beim Erstellen des Projekts.",
        });
      },
    }),
  );

  const onSubmit = (data: CreateProjectInputs) => {
    createProject.mutate(data);
  };

  const handleCopy = () => {
    if (!createdProjectId) return;
    navigator.clipboard.writeText(createdProjectId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreatedDialogClose = () => {
    setCreatedProjectId(null);
    router.push("/inbox");
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      form.reset();
      createProject.reset();
    }
  };

  // Keep organizationId in sync when activeOrg changes
  React.useEffect(() => {
    if (activeOrg?.id) {
      form.setValue("organizationId", activeOrg.id);
    }
  }, [activeOrg?.id, form]);

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {children ?? (
            <Button size="sm" className="w-full">
              <Plus className="size-4" />
              Neues Projekt
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Neues Projekt</DialogTitle>
            <DialogDescription>
              Ein Projekt entspricht einer Kunden-Website, auf der Sie Feedback
              sammeln möchten.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              {form.formState.errors.root && (
                <p className="text-destructive text-sm">
                  {form.formState.errors.root.message}
                </p>
              )}

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projektname</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Kunden-Website XYZ"
                        disabled={createProject.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="domain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Projekt-Domain</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="client.com"
                        disabled={createProject.isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Die Domain der Website Ihres Kunden. Subdomains, www.-
                      und Protokoll-Varianten werden automatisch erkannt.
                      Localhost ist für die lokale Entwicklung immer erlaubt.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={createProject.isPending}
                className="self-end"
              >
                {createProject.isPending ? "Wird erstellt..." : "Projekt erstellen"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!createdProjectId} onOpenChange={handleCreatedDialogClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Projekt erstellt</DialogTitle>
            <DialogDescription>
              Verwenden Sie diese Projekt-ID zur Installation des Widgets. Sie
              finden sie jederzeit in den Projekteinstellungen.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted flex items-center gap-2 rounded-md border p-3">
            <code className="flex-1 font-mono text-sm break-all">
              {createdProjectId}
            </code>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              {copied ? (
                <Check className="text-success size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>

          <Button onClick={handleCreatedDialogClose} className="w-full">
            Fertig
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
