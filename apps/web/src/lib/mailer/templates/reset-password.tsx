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

interface ResetPasswordProps {
  resetPasswordLink?: string;
}

const baseUrl = getAppUrl();

export const ResetPassword = ({
  resetPasswordLink,
}: ResetPasswordProps) => {
  return (
    <Html lang="de" dir="ltr">
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Body className="bg-secondary py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] bg-card px-[40px] py-[40px]">
            <Section>
              <Text className="mt-0 mb-[24px] text-[24px] font-bold text-foreground">
                Passwort zurücksetzen
              </Text>

              <Text className="mt-0 mb-[24px] text-[16px] leading-[24px] text-foreground">
                Hallo,
              </Text>

              <Text className="mt-0 mb-[24px] text-[16px] leading-[24px] text-foreground">
                Sie haben ein Zurücksetzen Ihres Passworts angefordert.
                Klicken Sie auf den Button unten, um ein neues Passwort zu
                erstellen.
              </Text>

              <Text className="mt-0 mb-[32px] text-[16px] leading-[24px] text-foreground">
                Dieser Link ist aus Sicherheitsgründen 24 Stunden gültig.
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  href={resetPasswordLink}
                  className="box-border bg-primary px-[32px] py-[12px] text-[16px] font-medium text-primary-foreground no-underline"
                >
                  Passwort zurücksetzen
                </Button>
              </Section>

              <Text className="mt-0 mb-[24px] text-[14px] leading-[20px] text-muted-foreground">
                Falls Sie den Button nicht anklicken können, kopieren Sie
                diesen Link in Ihren Browser:
              </Text>

              <Text className="mt-0 mb-[32px] text-[14px] break-all text-muted-foreground">
                {resetPasswordLink}
              </Text>

              <Hr className="my-[32px] border-border" />

              <Text className="mt-0 mb-[8px] text-[12px] text-muted-foreground">
                Falls Sie dieses Zurücksetzen nicht angefordert haben, können
                Sie diese E-Mail einfach ignorieren. Ihr Passwort bleibt
                unverändert.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
