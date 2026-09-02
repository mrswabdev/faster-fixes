import { DashboardSection } from "@/app/(authenticated)/_features/dashboard/dashboard-section";
import { DashboardPageContent } from "@/app/_features/core/dashboard/dashboard-page-content";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { Separator } from "@workspace/ui/components/separator";
import { AlertTriangleIcon } from "lucide-react";
import { AccountDeletionButton } from "./_features/account-deletion/account-deletion-button.client";
import { EmailForm } from "./_features/email/email-form.client";
import { PasswordForm } from "./_features/password/password-form.client";
import { ProfileAvatarUpload } from "./_features/profile/profile-avatar-upload.client";
import { ProfileForm } from "./_features/profile/profile-form.client";

export default function ParametersPage() {
  return (
    <DashboardPageContent
      breadcrumbs={[{ label: "Mein Konto" }, { label: "Einstellungen" }]}
    >
      <div className="flex flex-col gap-12">
        <DashboardSection
          title="Benutzerprofil"
          description="Aktualisieren Sie Ihre persönlichen Daten"
          cardTitle="Persönliche Daten"
          cardClassName="lg:max-w-md"
        >
          <div className="flex flex-col gap-6">
            <ProfileAvatarUpload />
            <Separator />
            <ProfileForm />
          </div>
        </DashboardSection>

        <DashboardSection
          title="E-Mail-Adresse"
          description="Ändern Sie die mit Ihrem Konto verknüpfte E-Mail-Adresse"
          cardTitle="Anmelde-E-Mail"
          cardClassName="lg:max-w-md"
        >
          <EmailForm />
        </DashboardSection>

        <DashboardSection
          title="Passwort"
          description="Ändern Sie Ihr Passwort, um Ihr Konto zu schützen"
          cardTitle="Kontosicherheit"
          cardClassName="lg:max-w-md"
        >
          <PasswordForm />
        </DashboardSection>

        <DashboardSection
          title="Konto löschen"
          description="Löschen Sie Ihr Konto und alle Ihre Daten endgültig"
          cardTitle="Gefahrenzone"
          cardClassName="lg:max-w-md"
        >
          <div className="flex flex-col gap-4">
            <Alert variant="destructive">
              <AlertTriangleIcon />
              <AlertDescription>
                Achtung: Das Löschen Ihres Kontos ist unwiderruflich. Alle Ihre
                Daten werden endgültig gelöscht und können nicht wiederhergestellt werden.
              </AlertDescription>
            </Alert>
            <AccountDeletionButton />
          </div>
        </DashboardSection>
      </div>
    </DashboardPageContent>
  );
}
