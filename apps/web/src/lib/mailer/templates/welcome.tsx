import {
  Body,
  Container,
  Head,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { emailTailwindConfig } from "./tailwind.config";

export interface WelcomeEmailProps {
  userName?: string;
}

export const WelcomeEmail = ({ userName }: WelcomeEmailProps) => {
  return (
    <Html lang="de" dir="ltr">
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Body className="bg-secondary py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] bg-card px-[40px] py-[40px]">
            <Section>
              <Text className="mt-0 mb-[16px] text-[16px] leading-[24px] text-foreground">
                {userName ? `Hallo ${userName},` : "Hallo,"}
              </Text>

              <Text className="mt-0 mb-[16px] text-[16px] leading-[24px] text-foreground">
                Willkommen bei AgencyDock Feedback! 🙂
              </Text>

              <Text className="mt-0 mb-[16px] text-[16px] leading-[24px] text-foreground">
                Ich bin Manuel, der Gründer der App. Danke für Ihre
                Anmeldung. Als Solo-Gründer bedeutet mir das sehr viel! 🙏
              </Text>

              <Text className="mt-0 mb-[16px] text-[16px] leading-[24px] text-foreground">
                Mich interessiert: Welches Problem löst AgencyDock Feedback
                für Sie?
              </Text>

              <Text className="mt-0 mb-[16px] text-[16px] leading-[24px] text-foreground">
                Sie können einfach auf diese E-Mail antworten. Ich lese
                jede Antwort persönlich, und sie hilft mir, AgencyDock
                Feedback noch nützlicher zu machen.
              </Text>

              <Text className="mt-0 mb-[4px] text-[16px] leading-[24px] text-foreground">
                Beste Grüße,
              </Text>
              <Text className="mt-0 mb-[16px] text-[16px] leading-[24px] text-foreground">
                Manuel
              </Text>

              <Text className="mt-0 mb-0 text-[14px] leading-[20px] text-muted-foreground">
                P.S. Falls Sie beim Einrichten des Tools irgendein Problem
                haben, lassen Sie es mich wissen.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
