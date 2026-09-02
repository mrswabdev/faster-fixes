import type { Metadata } from "next";
import { ForgotPasswordForm } from "./_features/forgot-password-form/forgot-password-form.client";

export const metadata: Metadata = {
  title: "Passwort vergessen",
  description: "Setzen Sie Ihr Passwort zurück.",
};

export default async function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Passwort zurücksetzen</h1>
            <p className="text-muted-foreground">
              Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen.
            </p>
          </div>

          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}