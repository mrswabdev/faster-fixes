import { GithubIcon } from "@workspace/ui/components/icons/github-icon";
import { JiraIcon } from "@workspace/ui/components/icons/jira-icon";
import { LinearIcon } from "@workspace/ui/components/icons/linear-icon";
import { McpIcon } from "@workspace/ui/components/icons/mcp-icon";
import { SlackIcon } from "@workspace/ui/components/icons/slack-icon";
import { DashboardSection } from "@/app/(authenticated)/_features/dashboard/dashboard-section";
import { DashboardPageContent } from "@/app/_features/core/dashboard/dashboard-page-content";
import { AgentTokensSection } from "./_features/agent-tokens/agent-tokens-section.client";
import { GitHubIntegrationSection } from "./_features/github/github-integration-section.client";
import { JiraIntegrationSection } from "./_features/jira/jira-integration-section.client";
import { LinearIntegrationSection } from "./_features/linear/linear-integration-section.client";
import { SlackIntegrationSection } from "./_features/slack/slack-integration-section.client";

export default function IntegrationsPage() {
  return (
    <DashboardPageContent breadcrumbs={[{ label: "Integrationen" }]}>
      <div className="flex flex-col gap-12">
        <DashboardSection
          title={
            <span className="flex items-center gap-2.5">
              <GithubIcon className="size-6 shrink-0" />
              GitHub
            </span>
          }
          description="Verbinden Sie Ihr GitHub-Konto, um automatisch Issues aus Feedback zu erstellen."
          cardTitle="GitHub-Integration"
          cardClassName="lg:max-w-lg"
        >
          <GitHubIntegrationSection />
        </DashboardSection>

        <DashboardSection
          title={
            <span className="flex items-center gap-2.5">
              <LinearIcon colored className="size-6 shrink-0" />
              Linear
            </span>
          }
          description="Verbinden Sie Ihren Linear-Workspace, um Feedback als Issues in Linear zu spiegeln."
          cardTitle="Linear-Integration"
          cardClassName="lg:max-w-lg"
        >
          <LinearIntegrationSection />
        </DashboardSection>

        <DashboardSection
          title={
            <span className="flex items-center gap-2.5">
              <JiraIcon colored className="size-6 shrink-0" />
              Jira
            </span>
          }
          description="Verbinden Sie Ihre Jira-Cloud-Site, um Feedback als Issues in Jira zu spiegeln."
          cardTitle="Jira-Integration"
          cardClassName="lg:max-w-lg"
        >
          <JiraIntegrationSection />
        </DashboardSection>

        <DashboardSection
          title={
            <span className="flex items-center gap-2.5">
              <SlackIcon colored className="size-6 shrink-0" />
              Slack
            </span>
          }
          description="Verbinden Sie Ihren Slack-Workspace, um bei neuem Feedback eine Nachricht zu erhalten."
          cardTitle="Slack-Integration"
          cardClassName="lg:max-w-lg"
        >
          <SlackIntegrationSection />
        </DashboardSection>

        <DashboardSection
          title={
            <span className="flex items-center gap-2.5">
              <McpIcon className="size-6 shrink-0" />
              MCP-Server
            </span>
          }
          description={
            <>
              API-Token zur Authentifizierung des Faster Fixes MCP-Servers.{" "}
              <a
                href="/docs/mcp/setup"
                className="text-primary underline underline-offset-4 hover:text-primary/80"
              >
                Einrichtungsanleitung
              </a>
            </>
          }
          cardTitle="MCP-Server"
          cardClassName="lg:max-w-lg"
        >
          <AgentTokensSection />
        </DashboardSection>
      </div>
    </DashboardPageContent>
  );
}
