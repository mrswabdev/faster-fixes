import { useCallback, useEffect, useRef, useState } from "react";
import { useFeedbackContext } from "../context.js";
import { ensureWidgetStyles } from "../animations.js";
import {
  dragHandleStyle,
  toolbarDockStyle,
  toolbarIconButtonStyle,
} from "../styles.js";
import {
  CameraIcon,
  ChatIcon,
  DragGridIcon,
  HelpIcon,
} from "./widget-icons.js";

const STORAGE_KEY_Y = "ff_toolbar_y";
const TOOLBAR_HEIGHT = 160;
const EDGE_MARGIN = 12;

function clampY(y: number) {
  const max = window.innerHeight - TOOLBAR_HEIGHT - EDGE_MARGIN;
  return Math.min(Math.max(y, EDGE_MARGIN), Math.max(max, EDGE_MARGIN));
}

function initialY() {
  if (typeof window === "undefined") return 120;
  try {
    const stored = localStorage.getItem(STORAGE_KEY_Y);
    if (stored !== null) return clampY(Number(stored));
  } catch {
    // localStorage unavailable
  }
  return clampY(window.innerHeight / 2 - TOOLBAR_HEIGHT / 2);
}

export function Toolbar() {
  const {
    mode,
    setMode,
    panelOpen,
    setPanelOpen,
    feedbackItems,
    labels,
    position,
    classNames,
  } = useFeedbackContext();

  const [y, setY] = useState(initialY);
  const dragState = useRef<{ pointerY: number; startY: number } | null>(null);

  useEffect(() => {
    ensureWidgetStyles();
  }, []);

  useEffect(() => {
    const onResize = () => setY((prev) => clampY(prev));
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onDragPointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      dragState.current = { pointerY: e.clientY, startY: y };
    },
    [y],
  );

  const onDragPointerMove = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      if (!dragState.current) return;
      const delta = e.clientY - dragState.current.pointerY;
      setY(clampY(dragState.current.startY + delta));
    },
    [],
  );

  const onDragPointerUp = useCallback(() => {
    if (!dragState.current) return;
    dragState.current = null;
    setY((finalY) => {
      try {
        localStorage.setItem(STORAGE_KEY_Y, String(finalY));
      } catch {
        // localStorage unavailable
      }
      return finalY;
    });
  }, []);

  const side = position.includes("left") ? "left" : "right";
  const annotating = mode === "annotating";
  const openCount = feedbackItems.filter(
    (f) => f.status !== "resolved" && f.status !== "closed",
  ).length;

  return (
    <div
      className={`ff-toolbar-dock ${classNames.toolbar ?? ""}`}
      data-side={side}
      style={toolbarDockStyle(side, y)}
      data-ff-widget
    >
      <span className="ff-toolbar-btn-wrap">
        <button
          type="button"
          className="ff-toolbar-icon-btn ff-widget-focusable"
          style={toolbarIconButtonStyle(annotating)}
          onClick={() => setMode(annotating ? "idle" : "annotating")}
          aria-label={labels.captureTooltip}
          aria-pressed={annotating}
        >
          <CameraIcon />
        </button>
        <span className="ff-toolbar-tip" role="presentation">
          {labels.captureTooltip}
        </span>
      </span>

      <span className="ff-toolbar-btn-wrap">
        <button
          type="button"
          className="ff-toolbar-icon-btn ff-widget-focusable"
          style={toolbarIconButtonStyle(panelOpen)}
          onClick={() => setPanelOpen(!panelOpen)}
          aria-label={labels.panelTooltip}
          aria-pressed={panelOpen}
        >
          <ChatIcon />
          {openCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: 3,
                right: 3,
                minWidth: 15,
                height: 15,
                borderRadius: 9999,
                backgroundColor: "var(--ff-accent)",
                color: "#fff",
                fontSize: 10,
                fontWeight: 600,
                lineHeight: "15px",
                textAlign: "center",
                padding: "0 3px",
                boxSizing: "border-box",
              }}
            >
              {openCount > 99 ? "99+" : openCount}
            </span>
          )}
        </button>
        <span className="ff-toolbar-tip" role="presentation">
          {labels.panelTooltip}
        </span>
      </span>

      <span className="ff-toolbar-btn-wrap">
        <button
          type="button"
          className="ff-toolbar-icon-btn ff-widget-focusable"
          style={toolbarIconButtonStyle(false)}
          aria-label={labels.helpTooltip}
        >
          <HelpIcon />
        </button>
        <span className="ff-toolbar-tip" role="presentation">
          {labels.helpTooltip}
        </span>
      </span>

      <span className="ff-toolbar-btn-wrap">
        <button
          type="button"
          style={dragHandleStyle}
          onPointerDown={onDragPointerDown}
          onPointerMove={onDragPointerMove}
          onPointerUp={onDragPointerUp}
          onPointerCancel={onDragPointerUp}
          aria-label={labels.dragTooltip}
        >
          <DragGridIcon />
        </button>
        <span className="ff-toolbar-tip" role="presentation">
          {labels.dragTooltip}
        </span>
      </span>
    </div>
  );
}
