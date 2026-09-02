"use client";

import { useTRPC } from "@/lib/trpc/trpc-client";
import { useMutation } from "@tanstack/react-query";
import { ActionButton } from "@workspace/ui/components/action-button";
import { buttonVariants } from "@workspace/ui/components/button";
import { VariantProps } from "class-variance-authority";
import { ReactNode } from "react";
import { toast } from "sonner";
import { SendVerificationEmailSchema } from "./send-verification-email.schema";

type SendVerificationEmailButtonProps = {
  email: string;
  className?: string;
  children?: ReactNode;
} & VariantProps<typeof buttonVariants>;

export function SendVerificationEmailButton({
  email,
  className,
  children = "Bestätigungs-E-Mail senden",
  variant = "secondary",
  size,
}: SendVerificationEmailButtonProps) {
  const trpc = useTRPC();
  const sendVerificationEmailMutation =
    useMutation(trpc.auth.sendVerificationEmail.mutationOptions());

  const handleSendVerificationEmail = () => {
    try {
      // Validate email input
      const validatedInput = SendVerificationEmailSchema.parse({ email });

      sendVerificationEmailMutation.mutate(validatedInput, {
        onSuccess: () => {
          toast.success("Bestätigungs-E-Mail erfolgreich gesendet");
        },
        onError: (error) => {
          toast.error(
            error?.message ||
            "Beim Senden der E-Mail ist ein Fehler aufgetreten",
          );
        },
      });
    } catch (error: any) {
      toast.error(
        error?.message ||
        "Bei der Validierung der E-Mail ist ein Fehler aufgetreten",
      );
    }
  };

  return (
    <ActionButton
      type="button"
      variant={variant}
      size={size}
      onClick={handleSendVerificationEmail}
      className={className}
      disabled={sendVerificationEmailMutation.isPending}
      pending={sendVerificationEmailMutation.isPending}
    >
      {children}
    </ActionButton>
  );
}
