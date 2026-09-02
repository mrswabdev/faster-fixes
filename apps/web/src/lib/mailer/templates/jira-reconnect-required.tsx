import { getAppUrl } from "@/utils/url/get-app-url";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { emailTailwindConfig } from "./tailwind.config";

export interface JiraReconnectRequiredProps {
  organizationName?: string;
  siteName?: string;
  integrationsLink?: string;
}

const baseUrl = getAppUrl();

export const JiraReconnectRequired = ({
  organizationName = "your organization",
  siteName = "your Jira site",
  integrationsLink = `${baseUrl}/integrations`,
}: JiraReconnectRequiredProps) => {
  return (
    <Html lang="de" dir="ltr">
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Body className="bg-secondary py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] bg-card px-[40px] py-[40px]">
            <Section>
              <Text className="mt-0 mb-[24px] text-[24px] font-bold text-foreground">
                Jira-Synchronisierung wurde gestoppt
              </Text>

              <Text className="mt-0 mb-[24px] text-[16px] leading-[24px] text-foreground">
                Die Jira-Autorisierung für <strong>{organizationName}</strong>{" "}
                ist nicht mehr gültig, daher hat AgencyDock Feedback die
                Synchronisierung mit <strong>{siteName}</strong> gestoppt. Das
                passiert in der Regel, wenn die Person, die Jira verbunden hat,
                den Zugriff auf die Seite verliert oder die Autorisierung
                widerruft.
              </Text>

              <Text className="mt-0 mb-[32px] text-[16px] leading-[24px] text-foreground">
                Verbinden Sie Jira erneut, um die Synchronisierung fortzusetzen.
                Ihre verknüpften Projekte und deren Einstellungen bleiben
                erhalten.
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  href={integrationsLink}
                  className="box-border bg-primary px-[32px] py-[12px] text-[16px] font-medium text-primary-foreground no-underline"
                >
                  Jira erneut verbinden
                </Button>
              </Section>

              <Text className="mt-0 mb-[24px] text-[14px] leading-[20px] text-muted-foreground">
                Falls Sie den Button nicht anklicken können, kopieren Sie
                diesen Link in Ihren Browser:
              </Text>

              <Text className="mt-0 mb-[32px] text-[14px] break-all text-muted-foreground">
                {integrationsLink}
              </Text>

              <Hr className="my-[32px] border-border" />

              <Text className="mt-0 mb-[8px] text-[12px] text-muted-foreground">
                Feedback wird weiterhin erfasst, während Jira getrennt ist. Nur
                die Spiegelung in Jira-Issues ist pausiert.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
