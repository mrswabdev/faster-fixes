import { auth } from "@/server/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "./_features/signup-form/signup-form.client";

export const metadata: Metadata = {
  title: "Registrieren",
  description: "Erstellen Sie Ihr Konto",
};

export default async function SignupPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/inbox");
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Ihr Konto erstellen</h1>
          </div>

          <SignupForm />

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Bereits ein Konto?{" "}
            </span>
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Anmelden
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
