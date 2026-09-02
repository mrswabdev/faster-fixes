export const SITE_NAME = "AgencyDock Feedback";
export const SITE_TAGLINE = "Website-Feedback für Agenturen";
export const SITE_META_DESCRIPTION =
  "Website-Feedback-Widget von AgencyDock: Kunden hinterlassen visuelle Anmerkungen direkt auf der Website — mit Screenshots, Anhängen und technischem Kontext.";
export const ITEMS_PER_SITEMAP = 50000; // Google's recommended limit

// Publisher logo for JSON-LD. Google's Article rich-result spec requires logo
// width/height — the 512×512 maskable icon already shipped via the PWA manifest
// is the simplest reusable source. Dimensions are strings because schema-dts
// types `width`/`height` as Schema.org `Distance` (which is a string).
export const PUBLISHER_LOGO = {
  url: "/images/android-chrome-512x512.png",
  width: "512",
  height: "512",
} as const;

export const SITE_LANGUAGE = "en";
