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

interface VerifyEmailProps {
  verificationLink?: string;
}

export const VerifyEmail = ({ verificationLink }: VerifyEmailProps) => {
  return (
    <Html lang="de" dir="ltr">
      <Tailwind config={emailTailwindConfig}>
        <Head />
        <Body className="bg-secondary py-[40px] font-sans">
          <Container className="mx-auto max-w-[600px] bg-card px-[40px] py-[40px]">
            <Section>
              <Text className="mt-0 mb-[24px] text-[24px] font-bold text-foreground">
                Bestätigen Sie Ihre E-Mail-Adresse
              </Text>

              <Text className="mt-0 mb-[24px] text-[16px] leading-[24px] text-foreground">
                Hallo,
              </Text>

              <Text className="mt-0 mb-[32px] text-[16px] leading-[24px] text-foreground">
                Vielen Dank für Ihre Anmeldung! Um Ihr Konto einzurichten,
                klicken Sie bitte auf den Button unten, um Ihre
                E-Mail-Adresse zu bestätigen.
              </Text>

              <Section className="mb-[32px] text-center">
                <Button
                  href={verificationLink}
                  className="box-border bg-primary px-[32px] py-[12px] text-[16px] font-medium text-primary-foreground no-underline"
                >
                  E-Mail bestätigen
                </Button>
              </Section>

              <Text className="mt-0 mb-[24px] text-[14px] leading-[20px] text-muted-foreground">
                Falls Sie den Button nicht anklicken können, kopieren Sie
                diesen Link in Ihren Browser:
              </Text>

              <Text className="mt-0 mb-[32px] text-[14px] break-all text-muted-foreground">
                {verificationLink}
              </Text>

              <Hr className="my-[32px] border-border" />

              <Text className="mt-0 mb-[8px] text-[12px] text-muted-foreground">
                Falls Sie kein Konto erstellt haben, können Sie diese E-Mail
                einfach ignorieren.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
