"use client";

import {
  ConsentManagerDialog,
  ConsentManagerProvider,
  CookieBanner,
} from "@c15t/nextjs";
import { ClientSideOptionsProvider } from "@c15t/nextjs/client";
import { ReactNode } from "react";

type ConsentProviderProps = {
  children: ReactNode;
};

export function ConsentProvider({ children }: ConsentProviderProps) {
  return (
    <ConsentManagerProvider
      options={{
        mode: "offline",
        consentCategories: ["necessary", "marketing", "measurement"], // Optional: Specify which consent categories to show in the banner.
        translations: {
          defaultLanguage: "en",
          translations: {
            en: {
              common: {
                acceptAll: "Alle akzeptieren",
                rejectAll: "Alle ablehnen",
                customize: "Anpassen",
                save: "Speichern",
              },
              cookieBanner: {
                title: "Cookie-Verwaltung",
                description:
                  "Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern, den Traffic zu analysieren und Inhalte zu personalisieren. Sie können alle Cookies akzeptieren, ablehnen oder Ihre Einstellungen anpassen.",
              },
              consentManagerDialog: {
                title: "Datenschutzeinstellungen",
                description:
                  "Verwalten Sie Ihre Cookie- und Datenschutzeinstellungen. Sie können diese Einstellungen jederzeit ändern.",
              },
              consentTypes: {
                necessary: {
                  title: "Notwendige Cookies",
                  description:
                    "Diese Cookies sind für die Funktion der Website unerlässlich und können nicht deaktiviert werden. Sie werden in der Regel als Reaktion auf von Ihnen getätigte Aktionen gesetzt, die eine Anfrage nach Diensten darstellen.",
                },
                marketing: {
                  title: "Marketing-Cookies",
                  description:
                    "Diese Cookies ermöglichen es uns, Werbung zu personalisieren und die Wirksamkeit unserer Marketingkampagnen zu messen. Sie können von unseren Werbepartnern gesetzt werden.",
                },
                measurement: {
                  title: "Analyse-Cookies",
                  description:
                    "Diese Cookies helfen uns, die Website-Nutzung zu analysieren, zu verstehen, wie Besucher mit unserer Website interagieren, und unsere Dienste zu verbessern.",
                },
              },
            },
          },
        },
      }}
    >
      <ClientSideOptionsProvider>
        <CookieBanner />
        <ConsentManagerDialog />

        {children}
      </ClientSideOptionsProvider>
    </ConsentManagerProvider>
  );
}
