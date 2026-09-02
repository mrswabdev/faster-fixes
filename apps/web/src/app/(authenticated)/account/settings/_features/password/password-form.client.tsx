"use client";

import { useTRPC } from "@/lib/trpc/trpc-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { PasswordInput } from "@workspace/ui/components/password-input";
import { AlertCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  ChangePasswordInputs,
  ChangePasswordSchema,
} from "./change-password.schema";

export function PasswordForm() {
  const trpc = useTRPC();

  const form = useForm<ChangePasswordInputs>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const changePasswordMutation =
    useMutation(trpc.authenticated.account.password.change.mutationOptions({
      onSuccess: () => {
        toast.success("Passwort erfolgreich geändert");
        form.reset();
      },
      onError: (error) => {
        const message = error.message || "Ein Fehler ist aufgetreten.";
        form.setError("root", { message });
      },
    }));

  const onSubmit = async (data: ChangePasswordInputs) => {
    changePasswordMutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
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
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aktuelles Passwort</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Aktuelles Passwort eingeben"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Neues Passwort</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Neues Passwort eingeben"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Mindestens 8 Zeichen, davon mindestens ein Großbuchstabe,
                ein Kleinbuchstabe und eine Zahl
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passwort bestätigen</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Neues Passwort bestätigen"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={changePasswordMutation.isPending}
          className="self-end"
        >
          {changePasswordMutation.isPending
            ? "Wird geändert..."
            : "Passwort ändern"}
        </Button>
      </form>
    </Form>
  );
}
