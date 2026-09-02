# FasterFixes — Self-Hosted auf Vercel

## Projekt-Übersicht

Self-hosted Instanz von [FasterFixes](https://github.com/manucoffin/faster-fixes) (AGPL-3.0): Feedback-System, das unstrukturiertes Client-Feedback (Nachrichten, Screenshots) in agent-ready Bug-Reports verwandelt. Fork: [mrswabdev/faster-fixes](https://github.com/mrswabdev/faster-fixes).

**Live:** https://faster-fixes-chi.vercel.app

## Tech Stack

- Next.js 16.2.1 (App Router, Turbopack), React 19, TypeScript
- tRPC 11, Better Auth (E-Mail-Verifizierung Pflicht), Prisma 7 (Adapter: Neon/pg)
- Turborepo-Monorepo, pnpm 10.4.1, Node ≥ 20
- Inngest (Background-Jobs), Cloudflare R2/S3 (Screenshots), Resend/Plunk (Mail)
- Stripe nur für die Cloud-Version — bei Self-Hosting ungenutzt (Platzhalter-Envs)

## Projektstruktur

- `apps/web/` — die Next.js-App (Vercel Root Directory)
- `packages/database/` — Prisma-Schema (`schema/schema.prisma`) + Migrationen
- `packages/widget-core|widget-react|mcp` — MIT-lizenzierte Widget-/MCP-Pakete
- `packages/widget-embed/` — **eigenes CSW-Package**: universelles Script-Embed; bündelt React + `@fasterfixes/react` per esbuild als IIFE nach `apps/web/public/widget.js` (Build: `pnpm --filter @fasterfixes/embed build`)
- `apps/web/src/content/docs/self-hosting.mdx` — offizielle Self-Hosting-Anleitung

## Widget-Einbindung (Kundenseiten)

**Universal (WordPress, statisch, egal welches CMS):**
```html
<script src="https://faster-fixes-chi.vercel.app/widget.js"
        data-project-id="proj_…" defer></script>
```
Optional: `data-color`, `data-position` (z. B. `bottom-left`), `data-api-origin` (Default = Origin der Script-URL, zeigt also automatisch auf unsere Instanz).

**React/Next-Seiten:** `@fasterfixes/react` mit `<FeedbackProvider projectId apiOrigin="https://faster-fixes-chi.vercel.app">` — ⚠️ ohne `apiOrigin` sendet das Widget an die Hersteller-Cloud (`www.faster-fixes.com`).

**Kunden-Flow:** Dashboard → Reviewers → Reviewer anlegen → Share-Link (`https://kundendomain?ff_token=…`) an den Kunden geben. Ohne Token rendert das Widget nichts (Besucher sehen nichts). Feedback-API prüft `x-api-key` (Projekt) + `x-reviewer-token` + Origin gegen die Projekt-Domain.

**Live-Einbindungen:**
- **csw.agency** (02.09.2026): Elementor-Pro-Custom-Code-Snippet #43317 („FasterFixes Feedback-Widget", body_end, publish) per EMCP; Projekt `proj_b8486e64a6c0e872107534fd`, Reviewer „Jürgen" aktiv, Flow end-to-end bestätigt (3 Test-Feedbacks im Board). ⚠️ FlyingPress-Cache: gecachte Seiten liefern das Snippet erst nach Purge/Ablauf aus — Share-Links mit `?ff_token=` umgehen den Cache ohnehin (Query-String). Purge per REST/App-Password geht nicht (403), im Zweifel WP-Admin → FlyingPress → Purge.

## Vercel-Setup

- Team: **csw1** (`team_kZv7GZhifShL6hBOKWw7jPv7`), Projekt: **faster-fixes** (`prj_v0h7NaHWC5dZbmFmCyZ2JIBi8Urb`)
- Root Directory: `apps/web`, Framework: Next.js, Deploy bisher via CLI (`vercel deploy --prod`)
- 28 Env-Variablen gesetzt (production + preview): Kern-URLs, echte Secrets für `BETTER_AUTH_SECRET` + Token-Encryption-Keys (Jira/Slack/Linear) + `GITHUB_WEBHOOK_SECRET`; Platzhalter für R2, Resend, Stripe, GitHub-App
- `NPM_TOKEN=placeholder-not-used` (die `.npmrc` referenziert es; nur fürs Publishing relevant)
- Lokale Änderung im Fork: `pnpm-workspace.yaml` → `onlyBuiltDependencies` (Prisma-Engines, sharp, esbuild u. a.), sonst blockt pnpm 10 die Build-Scripts

## Setup lokal

```bash
pnpm install   # pnpm 10.4.1 via corepack, Vercel CLI in ~/.local/bin
pnpm build     # Turbo: prisma generate → next build
```

Build braucht die Env-Variablen aus `apps/web/.env.example` (mehrere Module prüfen Envs beim Import: R2-Client, Jira/Slack/Linear-Keys, GitHub-Private-Key).

## Widget-UI (Feedbucket-Redesign, 02.09.2026)

Präsentationsschicht von `packages/widget-react/` komplett umgebaut (helles Theme):
- **Toolbar** (`components/toolbar.tsx`): weiße Dock-Leiste rechts, Kamera/Panel/Hilfe + Drag-Handle (Position in `localStorage["ff_toolbar_y"]`), Badge mit Open-Count
- **Flyout-Panel** (`components/feedback-panel.tsx` + `feedback-card.tsx`): Sheet volle Höhe `min(448px,100vw)`, Tabs Open/Resolved, Abschnitte „This page" / „Other pages" (nach Pathname gruppiert, Klick navigiert via `ff_pending_feedback`), ⋮-Menü mit Pin-Toggle
- **Pins** (`components/pin-marker.tsx`): Navy-Teardrop 32px, Status-Punkt, Spitze auf Ankerpunkt — Positionierungslogik unverändert
- `floating-button.tsx`/`feedback-list.tsx` bewusst **unreferenziert auf Platte belassen** (null Upstream-Diff); Context behält Legacy-Aliase (`showList`/`showResolved`)
- Neue Labels additiv in `packages/widget-core/src/constants.ts`
- Bewusst weggelassen (User-Entscheid): Video-Recording, Onboarding-Modal; Filter-Button entfällt in V1 (kein toter Button); kein Kommentar-Zähler (kein Thread-Modell)
- **Test-Reviewer „Claude Preview"** direkt in der DB angelegt (für lokale Tests; im Dashboard unter Reviewers revokebar). Lokale Testseite: launch.json-Eintrag `widget-test` (statischer Server, Scratchpad)

## Aktueller Status (02.09.2026)

✅ Fork + Clone, lokaler Build grün, Vercel-Projekt konfiguriert, **Produktions-Deploy live**.
✅ **Neon-DB verbunden** (Vercel Marketplace, `DATABASE_URL`/`DATABASE_URL_UNPOOLED` u. a. automatisch gesetzt), alle Prisma-Migrationen angewendet (`prisma migrate deploy` über die ungepoolte URL).
✅ **End-to-End verifiziert:** Registrierung + Login mit `service@csw.agency` funktionieren; App leitet in den Onboarding-Wizard. `emailVerified` wurde für diesen ersten Account manuell per SQL gesetzt (Resend ist noch Platzhalter — Verifizierungs-Mails gehen nicht raus). Achtung: Tabellennamen sind lowercase gemappt (`@@map("user")` etc.).

## Offene Tasks / nächste Schritte

1. **User:** Vercel-GitHub-App für `mrswabdev` autorisieren (Projekt → Settings → Git → Connect) → Auto-Deploys bei Push; alternativ `vercel git connect` erneut
2. **Resend**-API-Key (Pflicht — `requireEmailVerification: true`, ohne Mail keine weiteren Registrierungen) → Env `RESEND_API_KEY` ersetzen
3. **Cloudflare R2**-Bucket + Token → Storage-Envs ersetzen (Screenshot-Uploads)
4. **Inngest**-App anlegen → `INNGEST_EVENT_KEY`/`INNGEST_SIGNING_KEY` setzen, App unter `https://faster-fixes-chi.vercel.app/api/inngest` verbinden

✅ **R2-Storage LIVE (02.09.2026):** Bucket `fasterfixes-screenshots` im Cloudflare-Account `fb3977e0…` (BikePass/CSW-Account), Public-Domain `pub-f32d110bdeb446568882c4f0375e7921.r2.dev`. Zugang: Account-owned API-Token („round-queen-c402", Workers R2 Storage Edit, ohne Ablauf) — S3-Keys abgeleitet (Access Key = Token-ID, Secret = SHA-256 des Tokens). 6 Storage-Envs auf Vercel gesetzt, E2E verifiziert (Widget-Screenshot → R2 → Anzeige im Dashboard über signierte URLs). ⚠️ Direkt nach R2-Erstaktivierung liefert der S3-Endpoint einige Minuten TLS-Handshake-Failures (Zertifikats-Provisioning) — kein Konfigurationsfehler.
5. Onboarding in der App abschließen (Projekt anlegen, Widget-API-Key kopieren)
6. Optional: Custom Domain, GitHub-App-Integration, Linear/Slack/Jira
