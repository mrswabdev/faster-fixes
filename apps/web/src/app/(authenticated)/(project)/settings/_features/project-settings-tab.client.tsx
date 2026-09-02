"use client";

import { DashboardSection } from "@/app/(authenticated)/_features/dashboard/dashboard-section";
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
import { AlertTriangleIcon } from "lucide-react";

import { ApiKeyMigrationNotice } from "./api-key-migration-notice.client";
import { DeleteProjectButton } from "./delete/delete-project-button.client";
import { GitHubSection } from "./github/github-section.client";
import { JiraSection } from "./jira/jira-section.client";
import { LinearSection } from "./linear/linear-section.client";
import { SlackSection } from "./slack/slack-section.client";
import { UpdateProjectForm } from "./update/update-project-form.client";

type ProjectSettingsTabProps = {
  projectId: string;
};

export function ProjectSettingsTab({ projectId }: ProjectSettingsTabProps) {
  return (
    <div className="flex flex-col gap-12">
      <DashboardSection
        title="Projektinformationen"
        description="Name, URL und Widget-Konfiguration bearbeiten."
        cardTitle="Allgemeine Einstellungen"
        cardClassName="lg:max-w-lg"
      >
        <UpdateProjectForm projectId={projectId} />
      </DashboardSection>

      <DashboardSection
        title="API-Token"
        description="API-Token sind veraltet. Das Widget authentifiziert sich jetzt mit Ihrer Projekt-ID."
        cardTitle="API-Token (veraltet)"
        cardClassName="lg:max-w-lg"
      >
        <ApiKeyMigrationNotice projectId={projectId} />
      </DashboardSection>

      <DashboardSection
        title="GitHub"
        description="Verknüpfen Sie ein GitHub-Repository, um automatisch Issues aus Feedback zu erstellen."
        cardTitle="GitHub-Integration"
        cardClassName="lg:max-w-lg"
      >
        <GitHubSection projectId={projectId} />
      </DashboardSection>

      <DashboardSection
        title="Linear"
        description="Verknüpfen Sie ein Linear-Team, um Feedback als Issues in Linear zu spiegeln."
        cardTitle="Linear-Integration"
        cardClassName="lg:max-w-lg"
      >
        <LinearSection projectId={projectId} />
      </DashboardSection>

      <DashboardSection
        title="Jira"
        description="Verknüpfen Sie ein Jira-Projekt, um Feedback als Issues in Jira zu spiegeln."
        cardTitle="Jira-Integration"
        cardClassName="lg:max-w-lg"
      >
        <JiraSection projectId={projectId} />
      </DashboardSection>

      <DashboardSection
        title="Slack"
        description="Sendet bei neuem Feedback eine Nachricht an einen Channel."
        cardTitle="Slack-Integration"
        cardClassName="lg:max-w-lg"
      >
        <SlackSection projectId={projectId} />
      </DashboardSection>

      <DashboardSection
        title="Gefahrenzone"
        description="Das Löschen ist endgültig und unwiderruflich."
        cardTitle="Projekt löschen"
        cardClassName="lg:max-w-lg"
      >
        <div className="flex flex-col gap-4">
          <Alert variant="destructive">
            <AlertTriangleIcon />
            <AlertDescription>
              Achtung: Das Löschen dieses Projekts ist unwiderruflich. Alle
              Reviewer, alles Feedback und alle zugehörigen Dateien werden
              endgültig gelöscht.
            </AlertDescription>
          </Alert>
          <DeleteProjectButton projectId={projectId} />
        </div>
      </DashboardSection>
    </div>
  );
}
