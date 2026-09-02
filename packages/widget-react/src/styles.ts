import type { WidgetPosition } from "@fasterfixes/core";

export const Z_WIDGET = 2147483647;
const Z_PIN = 2147483646;
const Z_HIGHLIGHT = 2147483645;
const SHADOW_SM = "0 2px 8px rgba(0,0,0,0.08)";
const SHADOW_LG = "0 12px 32px rgba(0,0,0,0.12)";
const FONT_STACK = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

// Light theme (Feedbucket-style redesign). The dark values below in the legacy
// factories are only referenced by the retired FloatingButton/FeedbackList.
export const THEME = {
  bg: "#ffffff",
  surface: "#f9fafb",
  ring: "#e5e7eb",
  border: "#d1d5db",
  text: "#111827",
  textMuted: "#6b7280",
  navy: "#1f2a44",
  hover: "#f3f4f6",
  danger: "#dc2626",
} as const;

const SHADOW_TOOLBAR = "0 4px 12px rgba(0,0,0,0.08)";
const SHADOW_PANEL = "-8px 0 24px rgba(0,0,0,0.08)";

export const toolbarDockStyle = (
  side: "left" | "right",
  y: number,
): React.CSSProperties => ({
  position: "fixed",
  [side]: 12,
  top: y,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
  width: 48,
  padding: 4,
  backgroundColor: THEME.bg,
  borderRadius: 10,
  boxShadow: `0 0 0 1px ${THEME.ring}, ${SHADOW_TOOLBAR}`,
  zIndex: Z_WIDGET,
  pointerEvents: "auto",
  fontFamily: FONT_STACK,
});

export const toolbarIconButtonStyle = (
  active: boolean,
): React.CSSProperties => ({
  width: 40,
  height: 40,
  borderRadius: 8,
  backgroundColor: active ? THEME.hover : "transparent",
  color: active ? THEME.text : "#374151",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  transition: "background-color 0.15s ease, color 0.15s ease",
  flexShrink: 0,
  padding: 0,
});

export const dragHandleStyle: React.CSSProperties = {
  width: 40,
  height: 28,
  border: "none",
  backgroundColor: "transparent",
  color: "#9ca3af",
  cursor: "grab",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 8,
  padding: 0,
  touchAction: "none",
};

export const panelStyle = (exiting: boolean): React.CSSProperties => ({
  position: "fixed",
  top: 0,
  right: 0,
  height: "100dvh",
  width: "min(448px, 100vw)",
  backgroundColor: THEME.surface,
  boxShadow: SHADOW_PANEL,
  zIndex: Z_WIDGET,
  display: "flex",
  flexDirection: "column",
  fontFamily: FONT_STACK,
  fontSize: 14,
  color: THEME.text,
  pointerEvents: "auto",
  animation: exiting
    ? "ff-panel-slide-out 180ms ease-in forwards"
    : "ff-panel-slide-in 260ms cubic-bezier(0.22, 1, 0.36, 1)",
  boxSizing: "border-box",
});

export const panelHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 20px 12px",
  flexShrink: 0,
};

export const panelIconButtonStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  border: "none",
  backgroundColor: "transparent",
  color: THEME.textMuted,
  borderRadius: 6,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  transition: "background-color 0.15s ease, color 0.15s ease",
};

export const tabPillStyle = (active: boolean): React.CSSProperties => ({
  padding: "6px 14px",
  borderRadius: 9999,
  border: "none",
  backgroundColor: active ? "#e9eaec" : "transparent",
  color: active ? THEME.text : THEME.textMuted,
  fontSize: 14,
  fontWeight: active ? 600 : 400,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  transition: "background-color 0.15s ease, color 0.15s ease",
  fontFamily: "inherit",
});

export const tabCountStyle = (active: boolean): React.CSSProperties => ({
  fontSize: 12,
  fontWeight: 500,
  color: active ? THEME.textMuted : "#9ca3af",
  backgroundColor: active ? THEME.bg : "transparent",
  borderRadius: 9999,
  padding: "1px 7px",
  lineHeight: "16px",
});

export const sectionLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  color: THEME.textMuted,
  fontSize: 13,
  margin: "16px 0 10px",
};

export const sectionRuleStyle: React.CSSProperties = {
  flex: 1,
  height: 1,
  backgroundColor: THEME.ring,
};

export const cardStyle: React.CSSProperties = {
  backgroundColor: THEME.bg,
  borderRadius: 8,
  border: `1px solid ${THEME.ring}`,
  padding: "14px 16px",
  cursor: "pointer",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};

export const cardMetaStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: 12,
  marginTop: 10,
  color: THEME.textMuted,
  fontSize: 12,
};

export const collapsibleHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  border: "none",
  backgroundColor: "transparent",
  color: THEME.textMuted,
  fontSize: 13,
  cursor: "pointer",
  padding: "12px 0",
  fontFamily: "inherit",
};

export const POSITION_STYLES: Record<WidgetPosition, React.CSSProperties> = {
  "bottom-right": { bottom: 20, right: 20 },
  "bottom-left": { bottom: 20, left: 20 },
  "top-right": { top: 20, right: 20 },
  "top-left": { top: 20, left: 20 },
  "middle-right": { top: "50%", right: 20, transform: "translateY(-50%)" },
  "middle-left": { top: "50%", left: 20, transform: "translateY(-50%)" },
};

export const triggerButtonStyle = (): React.CSSProperties => ({
  width: 40,
  height: 40,
  borderRadius: "50%",
  backgroundColor: "var(--ff-accent)",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: SHADOW_SM,
  position: "relative",
  transition: "transform 0.15s ease, background-color 0.15s ease",
  flexShrink: 0,
});

export const toolbarStyle = (
  state: "collapsed" | "expanded" = "collapsed",
): React.CSSProperties => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 4,
  backgroundColor: "var(--ff-accent)",
  borderRadius: state === "expanded" ? 24 : "50%",
  padding: 4,
  width: 40,
  height: state === "expanded" ? 112 : 40,
  boxShadow: SHADOW_SM,
  cursor: state === "collapsed" ? "pointer" : "default",
  overflow: "visible",
  transition:
    "height 0.28s cubic-bezier(0.22, 1, 0.36, 1), border-radius 0.22s ease, transform 0.16s ease, background-color 0.15s ease",
});

export const toolbarButtonStyle: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  backgroundColor: "rgba(255,255,255,0.15)",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  transition: "background-color 0.15s ease",
};

export const popoverStyle: React.CSSProperties = {
  backgroundColor: THEME.bg,
  borderRadius: 10,
  boxShadow: `0 0 0 1px ${THEME.ring}, ${SHADOW_LG}`,
  padding: 16,
  width: 320,
  zIndex: Z_WIDGET,
  fontFamily: FONT_STACK,
  fontSize: 14,
  color: THEME.text,
  pointerEvents: "auto",
};

export const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 80,
  padding: 8,
  border: `1px solid ${THEME.border}`,
  borderRadius: 6,
  resize: "vertical",
  fontFamily: "inherit",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: THEME.bg,
  color: THEME.text,
};

export const buttonBaseStyle: React.CSSProperties = {
  padding: "6px 14px",
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  border: "none",
  transition: "opacity 0.15s ease",
};

export const primaryButtonStyle = (): React.CSSProperties => ({
  ...buttonBaseStyle,
  backgroundColor: "var(--ff-accent)",
  color: "#fff",
});

export const secondaryButtonStyle: React.CSSProperties = {
  ...buttonBaseStyle,
  backgroundColor: "transparent",
  color: THEME.textMuted,
};

export const pinStyle = (statusColor: string): React.CSSProperties => ({
  width: 24,
  height: 24,
  borderRadius: "50%",
  backgroundColor: statusColor,
  border: "2px solid #27272a",
  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "fixed",
  zIndex: Z_PIN,
  transition: "transform 0.15s ease, opacity 0.15s ease",
  pointerEvents: "auto",
});

export const overlayHighlightStyle: React.CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  border: "2px solid",
  borderRadius: 4,
  backgroundColor: "rgba(99, 102, 241, 0.1)",
  zIndex: Z_HIGHLIGHT,
  transition: "all 0.1s ease",
};

export const feedbackListStyle: React.CSSProperties = {
  backgroundColor: "#1c1c1c",
  borderRadius: 8,
  boxShadow: SHADOW_LG,
  maxHeight: 320,
  overflowY: "auto",
  width: 320,
  zIndex: Z_WIDGET,
  fontFamily: FONT_STACK,
  fontSize: 13,
  color: "#e4e4e7",
  pointerEvents: "auto",
};

export const feedbackListItemStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderBottom: "1px solid #3f3f46",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
  transition: "background-color 0.1s ease",
};
