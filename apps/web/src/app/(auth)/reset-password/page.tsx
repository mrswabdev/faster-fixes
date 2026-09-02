import { forgotPasswordUrl, loginUrl } from "@/app/_constants/routes";
import { PageParams } from "@/types/next";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@workspace/ui/components/alert";
import { Button } from "@workspace/ui/components/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ResetPasswordForm } from "./_features/reset-password-form/reset-password-form.client";

export default async function ResetPasswordPage(props: PageParams) {
  const searchParams = await props.searchParams;
  const { success, error, token } = searchParams;

  return (
    <div className="bg-background flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {success === "true" ? (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="flex items-center justify-center gap-2 text-2xl font-bold">
                <CheckCircle2 className="size-5" />
                <span>Passwort zurückgesetzt!</span>
              </h1>
              <p className="text-muted-foreground">
                Ihr Passwort wurde erfolgreich zurückgesetzt. Sie können sich nun mit
                Ihrem neuen Passwort anmelden.
              </p>
            </div>

            <div className="flex justify-center">
              <Button variant="default" className="" asChild>
                <Link href={loginUrl}>Anmelden</Link>
              </Button>
            </div>
          </div>
        ) : error === "INVALID_TOKEN" ? (
          <>
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="size-4" />
              <AlertTitle>Ungültiger oder abgelaufener Link</AlertTitle>
              <AlertDescription>
                Der verwendete Link zum Zurücksetzen ist ungültig oder abgelaufen. Bitte
                fordern Sie einen neuen Link an.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <Button className="w-full" asChild>
                <Link href={forgotPasswordUrl}>Neuen Link anfordern</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={loginUrl}>Zurück zur Anmeldung</Link>
              </Button>
            </div>
          </>
        ) : token ? (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold">Passwort zurücksetzen</h1>
              <p className="text-muted-foreground">
                Geben Sie unten Ihr neues Passwort ein, um das Passwort Ihres Kontos zurückzusetzen.
              </p>
            </div>

            <ResetPasswordForm token={token as string} />
          </div>
        ) : (
          <>
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="size-4" />
              <AlertTitle>Fehlender Parameter</AlertTitle>
              <AlertDescription>
                Das Token zum Zurücksetzen fehlt. Bitte verwenden Sie den Link aus
                Ihrer E-Mail oder fordern Sie einen neuen Link an.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <Button className="w-full" asChild>
                <Link href={forgotPasswordUrl}>Neuen Link anfordern</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={loginUrl}>Zurück zur Anmeldung</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
