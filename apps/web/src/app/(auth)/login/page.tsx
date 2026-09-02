import { signupUrl } from "@/app/_constants/routes";
import { auth } from "@/server/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "./_features/login-form/login-form.client";

export const metadata: Metadata = {
  title: "Anmelden",
  description: "Melden Sie sich bei Ihrem Konto an.",
};

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/inbox");
  }
  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Bei Ihrem Konto anmelden</h1>
          </div>

          <Suspense>
            <LoginForm />
          </Suspense>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Noch kein Konto?{" "}
            </span>
            <Link
              href={signupUrl}
              className="text-primary font-medium hover:underline"
            >
              Registrieren
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
