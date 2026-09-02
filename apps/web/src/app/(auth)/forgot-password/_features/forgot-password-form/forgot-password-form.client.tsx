"use client";

import { loginUrl } from "@/app/_constants/routes";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { AlertCircleIcon, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  ForgotPasswordInputs,
  ForgotPasswordSchema,
} from "./forgot-password.schema";

export function ForgotPasswordForm() {
  const trpc = useTRPC();
  const form = useForm<ForgotPasswordInputs>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation(
    trpc.auth.forgotPassword.mutationOptions({
      onError: (error) => {
        const message =
          error.message || "E-Mail zum Zurücksetzen konnte nicht gesendet werden. Bitte versuchen Sie es erneut.";
        form.setError("root", { message });
      },
      onSuccess: () => {
        form.reset();
        form.clearErrors();
      },
    }),
  );

  const onSubmit = async (data: { email: string }) => {
    forgotPasswordMutation.mutate(data);
  };

  const isSuccess =
    forgotPasswordMutation.isSuccess && !form.formState.errors.root;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Server Error */}
        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>Fehler</AlertTitle>
            <AlertDescription>
              <p>{form.formState.errors.root.message}</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Success Message */}
        {isSuccess && (
          <Alert variant="success">
            <CheckCircle2 />
            <AlertTitle>Erfolgreich</AlertTitle>
            <AlertDescription>
              <p>Eine E-Mail zum Zurücksetzen des Passworts wurde an Ihre E-Mail-Adresse gesendet.</p>
            </AlertDescription>
          </Alert>
        )}

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-Mail</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  {...field}
                  disabled={forgotPasswordMutation.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={forgotPasswordMutation.isPending || isSuccess}
          size="lg"
        >
          {forgotPasswordMutation.isPending ? "Wird gesendet..." : "Link zum Zurücksetzen senden"}
        </Button>
      </form>

      {/* Back to Login Link */}
      <div className="mt-4 text-center text-sm">
        <span className="text-muted-foreground">Passwort wieder eingefallen? </span>
        <Link
          href={loginUrl}
          className="text-primary font-medium hover:underline"
        >
          Anmelden
        </Link>
      </div>
    </Form>
  );
}
