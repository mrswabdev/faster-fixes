"use client";

import { DashboardSection } from "@/app/(authenticated)/_features/dashboard/dashboard-section";
import { DeleteOrganizationSection } from "./delete-organization-section.client";
import { OrganizationLogoUpload } from "./organization-logo-upload.client";
import { UpdateOrganizationForm } from "./update-organization-form.client";

export function OrganizationGeneralTab() {
  return (
    <div className="flex flex-col gap-12">
      <DashboardSection
        title="Logo"
        description="Ändern Sie das Logo Ihrer Organisation"
        cardTitle="Organisationslogo"
        cardClassName="lg:max-w-md"
      >
        <OrganizationLogoUpload />
      </DashboardSection>

      <DashboardSection
        title="Allgemeine Informationen"
        description="Aktualisieren Sie den Namen Ihrer Organisation"
        cardTitle="Organisationsinformationen"
        cardClassName="lg:max-w-md"
      >
        <UpdateOrganizationForm />
      </DashboardSection>

      <DashboardSection
        title="Organisation löschen"
        description="Löschen Sie diese Organisation und alle ihre Daten endgültig"
        cardTitle="Gefahrenzone"
        cardClassName="lg:max-w-md"
      >
        <DeleteOrganizationSection />
      </DashboardSection>
    </div>
  );
}
