import { createRoot } from "react-dom/client";
import { FeedbackProvider } from "@fasterfixes/react";
import type { WidgetPosition } from "@fasterfixes/core";

// document.currentScript is only valid during initial synchronous execution,
// so capture it before any async boundary. Page optimizers (e.g. FlyingPress
// on cached pages) may strip data-* attributes or re-inject the tag, so the
// query string of the script URL is the survivable config channel and the
// tag is also findable by its src.
const script =
  (document.currentScript as HTMLScriptElement | null) ??
  document.querySelector<HTMLScriptElement>('script[src*="/widget.js"]');
const dataset = script?.dataset ?? {};
const srcParams = (() => {
  try {
    return script?.src ? new URL(script.src).searchParams : null;
  } catch {
    return null;
  }
})();

// Last-resort fallback: remember the id once resolved, so stale cached pages
// whose optimizer stripped every config channel still mount after the
// reviewer has visited any working page (the share link always works).
const STORAGE_KEY_PROJECT = "ff_project_id";
const storedProjectId = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY_PROJECT) ?? undefined;
  } catch {
    return undefined;
  }
})();

const projectId =
  dataset.projectId || srcParams?.get("pid") || storedProjectId || undefined;
if (projectId && projectId !== storedProjectId) {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECT, projectId);
  } catch {
    // storage unavailable
  }
}
const position = dataset.position || srcParams?.get("position") || undefined;
const color = dataset.color || srcParams?.get("color") || undefined;
// Default the API origin to wherever this bundle is served from — the embed
// works against any self-hosted instance without extra configuration.
const apiOrigin =
  dataset.apiOrigin ||
  srcParams?.get("origin") ||
  (script?.src ? new URL(script.src).origin : undefined);

const MOUNT_ID = "fasterfixes-widget-root";

function mount() {
  if (!projectId) {
    console.warn(
      "[FasterFixes] Missing project id — set data-project-id on the embed <script> tag or a ?pid= query param on its src.",
    );
    return;
  }
  if (document.getElementById(MOUNT_ID)) return;

  const host = document.createElement("div");
  host.id = MOUNT_ID;
  document.body.appendChild(host);

  createRoot(host).render(
    <FeedbackProvider
      projectId={projectId}
      apiOrigin={apiOrigin}
      color={color}
      position={position as WidgetPosition | undefined}
    >
      {null}
    </FeedbackProvider>,
  );
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
