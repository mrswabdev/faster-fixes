import type { FeedbackStatus, WidgetPosition } from "./types.js";

export const FEEDBACK_STATUSES: FeedbackStatus[] = [
  "new",
  "in_progress",
  "resolved",
  "closed",
];

export const WIDGET_POSITIONS: WidgetPosition[] = [
  "bottom-right",
  "bottom-left",
  "top-right",
  "top-left",
  "middle-right",
  "middle-left",
];

export const STATUS_COLORS: Record<FeedbackStatus, string> = {
  new: "#ef4444",
  in_progress: "#f59e0b",
  resolved: "#22c55e",
  closed: "#6b7280",
};

export const DEFAULT_API_ORIGIN = "https://www.faster-fixes.com";

export const DEFAULT_WIDGET_COLOR = "#2F6BFF";
export const DEFAULT_WIDGET_POSITION: WidgetPosition = "bottom-right";

export const DEFAULT_LABELS = {
  submitButton: "Senden",
  cancelButton: "Abbrechen",
  textareaPlaceholder: "Beschreiben Sie das Anliegen …",
  successMessage: "Feedback gesendet",
  closeButton: "Schließen",
  retryButton: "Erneut versuchen",
  errorMessage: "Etwas ist schiefgelaufen",
  deleteConfirm: "Dieses Feedback löschen?",
  deleteButton: "Löschen",
  editButton: "Bearbeiten",
  saveButton: "Speichern",
  showResolved: "Erledigte anzeigen",
  hideResolved: "Erledigte ausblenden",
  feedbackListTitle: "Feedback",
  emptyList: "Kein Feedback auf dieser Seite",
  openTab: "Offen",
  resolvedTab: "Erledigt",
  thisPageSection: "Diese Seite",
  otherPagesSection: "Andere Seiten",
  captureTooltip: "Feedback hinterlassen",
  panelTooltip: "Feedback ansehen",
  helpTooltip: "Auf die Kamera klicken, dann eine Stelle auf der Seite anklicken und kommentieren.",
  dragTooltip: "Leiste verschieben",
  showMarkers: "Markierungen anzeigen",
  hideMarkers: "Markierungen ausblenden",
  replyPlaceholder: "Antworten …",
  replyButton: "Antworten",
  noReplies: "Noch keine Antworten",
  attachButton: "Dateien anhängen",
  attachmentTooLarge: "Datei zu groß (max. 10 MB)",
  attachmentWrongType: "Nur Bilder und PDF sind erlaubt",
  attachmentTooMany: "Maximal 4 Dateien pro Nachricht",
  formerMember: "Ehemaliges Teammitglied",
  teamBadge: "Team",
} as const;

export type Labels = typeof DEFAULT_LABELS;

export const STORAGE_KEY_TOKEN = "ff_reviewer_token";
export const URL_PARAM_TOKEN = "ff_token";

// Diagnostic Trail (console + network capture) bounds and redaction denylist.
// Independent ring per stream; oldest entries drop once full.
// Attachment rules — single source of truth: the web app's API routes import
// these same values, so client validation and server enforcement cannot drift.
export const ALLOWED_ATTACHMENT_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
] as const;
export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;
export const MAX_ATTACHMENTS_PER_MESSAGE = 4;

export const DIAGNOSTICS_MAX_ENTRIES = 50;
export const DIAGNOSTICS_MAX_MESSAGE_BYTES = 2048;

// Param names whose *values* are redacted from captured network URLs. Compared
// after lowercasing and stripping `_`/`-`, so `access_token` matches here.
export const DIAGNOSTICS_REDACT_PARAMS = [
  "token",
  "accesstoken",
  "refreshtoken",
  "idtoken",
  "key",
  "apikey",
  "secret",
  "clientsecret",
  "password",
  "passwd",
  "pwd",
  "auth",
  "authorization",
  "bearer",
  "session",
  "sessionid",
  "sid",
  "signature",
  "sig",
  "email",
  "jwt",
] as const;
