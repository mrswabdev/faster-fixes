import { createRoot } from "react-dom/client";
import { FeedbackProvider } from "@fasterfixes/react";
import type { WidgetPosition } from "@fasterfixes/core";

// document.currentScript is only valid during initial synchronous execution,
// so capture it before any async boundary.
const script = document.currentScript as HTMLScriptElement | null;
const dataset = script?.dataset ?? {};

const projectId = dataset.projectId;
// Default the API origin to wherever this bundle is served from — the embed
// works against any self-hosted instance without extra configuration.
const apiOrigin =
  dataset.apiOrigin ||
  (script?.src ? new URL(script.src).origin : undefined);

const MOUNT_ID = "fasterfixes-widget-root";

function mount() {
  if (!projectId) {
    console.warn(
      "[FasterFixes] Missing data-project-id on the embed <script> tag.",
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
      color={dataset.color}
      position={dataset.position as WidgetPosition | undefined}
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
