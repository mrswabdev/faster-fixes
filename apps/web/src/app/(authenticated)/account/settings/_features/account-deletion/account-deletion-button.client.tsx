"use client";

import { signOut } from "@/lib/auth";
import { useTRPC } from "@/lib/trpc/trpc-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { PasswordInput } from "@workspace/ui/components/password-input";
import { AlertCircleIcon, AlertTriangleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  DeleteAccountInputs,
  DeleteAccountSchema,
} from "./delete-account.schema";

export function AccountDeletionButton() {
  const trpc = useTRPC();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const form = useForm<DeleteAccountInputs>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      password: "",
    },
  });

  const deleteAccountMutation = useMutation(trpc.authenticated.account.delete.mutationOptions({
    onSuccess: async () => {
      toast.success("Ihr Konto wurde erfolgreich gelöscht");
      setOpen(false);

      // Sign out and redirect
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    },
    onError: (error) => {
      const message = error.message || "Ein Fehler ist aufgetreten.";
      form.setError("root", { message });
    },
  }));

  const onSubmit = async (data: DeleteAccountInputs) => {
    deleteAccountMutation.mutate(data);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when dialog closes
      form.reset();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-fit self-end">
          Mein Konto löschen
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangleIcon className="text-destructive h-5 w-5" />
            <AlertDialogTitle>
              Konto endgültig löschen
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            Diese Aktion ist unwiderruflich. Alle Ihre Daten werden
            endgültig gelöscht und Ihr Konto kann nicht wiederhergestellt werden.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            {form.formState.errors.root && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Fehler</AlertTitle>
                <AlertDescription>
                  <p>{form.formState.errors.root.message}</p>
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zur Bestätigung Passwort eingeben</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Passwort eingeben"
                      autoComplete="current-password"
                      disabled={deleteAccountMutation.isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteAccountMutation.isPending}>
                Abbrechen
              </AlertDialogCancel>
              <Button
                type="submit"
                variant="destructive"
                disabled={deleteAccountMutation.isPending}
              >
                {deleteAccountMutation.isPending
                  ? "Wird gelöscht..."
                  : "Löschen bestätigen"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
