// Keyframes + hover/focus rules the inline-style system cannot express.
// Injected once per document; v2 id so it never collides with the retired
// FloatingButton's "ff-widget-animations" block.
const STYLE_ID = "ff-widget-styles-v2";

export function ensureWidgetStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes ff-panel-slide-in {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes ff-panel-slide-out {
      from { transform: translateX(0); }
      to { transform: translateX(100%); }
    }
    @keyframes ff-toolbar-pop {
      from { transform: scale(0.92); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    @keyframes ff-popover-fadeout {
      from { transform: translateY(0); opacity: 1; }
      to { transform: translateY(8px); opacity: 0; }
    }
    .ff-toolbar-dock {
      animation: ff-toolbar-pop 200ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    .ff-toolbar-icon-btn:hover { background-color: #f3f4f6 !important; color: #111827 !important; }
    .ff-panel-icon-btn:hover { background-color: #e9eaec !important; color: #111827 !important; }
    .ff-card:hover { border-color: #d1d5db !important; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .ff-collapsible:hover { color: #111827 !important; }
    .ff-widget-focusable:focus-visible {
      outline: 2px solid #1f2a44;
      outline-offset: 2px;
    }
    .ff-toolbar-tip {
      position: absolute;
      top: 50%;
      right: calc(100% + 10px);
      transform: translate(4px, -50%);
      width: max-content;
      max-width: 200px;
      padding: 6px 9px;
      border-radius: 6px;
      background: #1f2a44;
      color: #ffffff;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      font: 500 12px/1.35 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      text-align: left;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      z-index: 2147483647;
      transition: opacity 130ms ease, transform 130ms ease, visibility 130ms ease;
      transition-delay: 450ms;
    }
    .ff-toolbar-dock[data-side="left"] .ff-toolbar-tip {
      right: auto;
      left: calc(100% + 10px);
      transform: translate(-4px, -50%);
    }
    .ff-toolbar-btn-wrap { position: relative; display: flex; }
    .ff-toolbar-btn-wrap:hover .ff-toolbar-tip {
      opacity: 1;
      visibility: visible;
      transform: translate(0, -50%);
    }
    .ff-panel-scroll { scrollbar-width: thin; scrollbar-color: #d1d5db transparent; }
    .ff-panel-scroll::-webkit-scrollbar { width: 8px; }
    .ff-panel-scroll::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
    @media (prefers-reduced-motion: reduce) {
      .ff-toolbar-dock, [data-ff-widget] * { animation-duration: 0.01ms !important; }
    }
  `;
  document.head.appendChild(style);
}
