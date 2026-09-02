import { useEffect, useMemo, useRef, useState } from "react";
import type { FeedbackItem, SelectorStrategies } from "@fasterfixes/core";
import { resolveElement } from "@fasterfixes/core";
import { useFeedbackContext } from "../context.js";
import { ensureWidgetStyles } from "../animations.js";
import {
  collapsibleHeaderStyle,
  panelHeaderStyle,
  panelIconButtonStyle,
  panelStyle,
  sectionLabelStyle,
  sectionRuleStyle,
  tabCountStyle,
  tabPillStyle,
  THEME,
} from "../styles.js";
import { FeedbackCard } from "./feedback-card.js";
import {
  ChevronDownIcon,
  CloseIcon,
  KebabIcon,
} from "./widget-icons.js";

const EXIT_DURATION = 180;

function isOpen(item: FeedbackItem) {
  return item.status !== "resolved" && item.status !== "closed";
}

export function FeedbackPanel() {
  const {
    feedbackItems,
    panelOpen,
    setPanelOpen,
    panelTab,
    setPanelTab,
    setActiveFeedback,
    setHighlightSelector,
    showPins,
    setShowPins,
    labels,
    config,
    classNames,
  } = useFeedbackContext();

  // Delayed unmount keeps the sheet in the tree through its exit slide.
  const [mounted, setMounted] = useState(panelOpen);
  const [exiting, setExiting] = useState(false);
  const [otherPagesExpanded, setOtherPagesExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    ensureWidgetStyles();
  }, []);

  useEffect(() => {
    if (panelOpen) {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      setExiting(false);
      setMounted(true);
    } else if (mounted) {
      setMenuOpen(false);
      setExiting(true);
      timerRef.current = setTimeout(() => {
        setMounted(false);
        setExiting(false);
      }, EXIT_DURATION);
    }
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [panelOpen, mounted]);

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const { thisPage, otherPages, openCount, resolvedCount } = useMemo(() => {
    const inTab = (f: FeedbackItem) =>
      panelTab === "open" ? isOpen(f) : !isOpen(f);
    return {
      thisPage: feedbackItems.filter(
        (f) => f.pageUrl === currentUrl && inTab(f),
      ),
      otherPages: feedbackItems.filter(
        (f) => f.pageUrl !== currentUrl && inTab(f),
      ),
      openCount: feedbackItems.filter(isOpen).length,
      resolvedCount: feedbackItems.filter((f) => !isOpen(f)).length,
    };
  }, [feedbackItems, currentUrl, panelTab]);

  // Group other-page cards by pathname so long lists stay scannable.
  const otherPageGroups = useMemo(() => {
    const groups = new Map<string, FeedbackItem[]>();
    for (const item of otherPages) {
      let key = item.pageUrl;
      try {
        key = new URL(item.pageUrl).pathname;
      } catch {
        // keep full URL as the label
      }
      groups.set(key, [...(groups.get(key) ?? []), item]);
    }
    return [...groups.entries()];
  }, [otherPages]);

  if (!mounted) return null;

  const selectThisPageItem = (item: FeedbackItem) => {
    const strategies = (item.metadata as Record<string, unknown> | null)
      ?.selectors as SelectorStrategies | undefined;
    const el = resolveElement(item.selector, strategies);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    setActiveFeedback(item);
    setHighlightSelector(item.selector ?? null);
    // The sheet covers the right half of the page — close it so the pin
    // and its popover are actually visible.
    setPanelOpen(false);
  };

  const selectOtherPageItem = (item: FeedbackItem) => {
    if (
      !item.pageUrl.startsWith("https://") &&
      !item.pageUrl.startsWith("http://")
    )
      return;
    try {
      sessionStorage.setItem("ff_pending_feedback", item.id);
    } catch {
      // sessionStorage unavailable
    }
    window.location.href = item.pageUrl;
  };

  return (
    <div
      className={`ff-panel ${classNames.panel ?? ""}`}
      style={panelStyle(exiting)}
      data-ff-widget
      role="dialog"
      aria-label={labels.feedbackListTitle}
    >
      {/* Header */}
      <div style={panelHeaderStyle}>
        <span style={{ fontSize: 18, fontWeight: 700 }}>
          {labels.feedbackListTitle}
        </span>
        <div style={{ display: "flex", gap: 4, position: "relative" }}>
          <button
            type="button"
            className="ff-panel-icon-btn ff-widget-focusable"
            style={panelIconButtonStyle}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="More options"
            aria-expanded={menuOpen}
          >
            <KebabIcon />
          </button>
          <button
            type="button"
            className="ff-panel-icon-btn ff-widget-focusable"
            style={panelIconButtonStyle}
            onClick={() => setPanelOpen(false)}
            aria-label={labels.closeButton}
          >
            <CloseIcon />
          </button>

          {menuOpen && (
            <div
              style={{
                position: "absolute",
                top: 36,
                right: 0,
                backgroundColor: THEME.bg,
                borderRadius: 8,
                boxShadow: `0 0 0 1px ${THEME.ring}, 0 8px 24px rgba(0,0,0,0.12)`,
                padding: 4,
                minWidth: 160,
              }}
            >
              <button
                type="button"
                className="ff-panel-icon-btn ff-widget-focusable"
                style={{
                  ...panelIconButtonStyle,
                  width: "100%",
                  height: 34,
                  justifyContent: "flex-start",
                  padding: "0 10px",
                  fontSize: 13,
                  color: THEME.text,
                  fontFamily: "inherit",
                }}
                onClick={() => {
                  setShowPins(!showPins);
                  setMenuOpen(false);
                }}
              >
                {showPins ? labels.hideMarkers : labels.showMarkers}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 20px 12px",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          className="ff-widget-focusable"
          style={tabPillStyle(panelTab === "open")}
          onClick={() => setPanelTab("open")}
          aria-pressed={panelTab === "open"}
        >
          {labels.openTab}
          <span style={tabCountStyle(panelTab === "open")}>{openCount}</span>
        </button>
        <button
          type="button"
          className="ff-widget-focusable"
          style={tabPillStyle(panelTab === "resolved")}
          onClick={() => setPanelTab("resolved")}
          aria-pressed={panelTab === "resolved"}
        >
          {labels.resolvedTab}
          <span style={tabCountStyle(panelTab === "resolved")}>
            {resolvedCount}
          </span>
        </button>
      </div>

      {/* Scrollable content */}
      <div
        className="ff-panel-scroll"
        style={{ flex: 1, overflowY: "auto", padding: "0 20px 8px" }}
      >
        <div style={sectionLabelStyle}>
          <span style={sectionRuleStyle} role="presentation" />
          {labels.thisPageSection}
          <span style={sectionRuleStyle} role="presentation" />
        </div>

        {thisPage.length === 0 ? (
          <div
            style={{
              padding: "24px 0",
              textAlign: "center",
              color: THEME.textMuted,
              fontSize: 13,
            }}
          >
            {labels.emptyList}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {thisPage.map((item) => (
              <FeedbackCard
                key={item.id}
                item={item}
                onSelect={selectThisPageItem}
                className={classNames.panelCard}
              />
            ))}
          </div>
        )}

        {otherPages.length > 0 && (
          <>
            <button
              type="button"
              className="ff-collapsible ff-widget-focusable"
              style={{ ...collapsibleHeaderStyle, marginTop: 8 }}
              onClick={() => setOtherPagesExpanded(!otherPagesExpanded)}
              aria-expanded={otherPagesExpanded}
            >
              <span style={sectionRuleStyle} role="presentation" />
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                }}
              >
                {labels.otherPagesSection}
                <span
                  style={{
                    backgroundColor: "#e9eaec",
                    borderRadius: 9999,
                    padding: "1px 8px",
                    fontSize: 12,
                    fontWeight: 600,
                    color: THEME.text,
                  }}
                >
                  {otherPages.length}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    transform: otherPagesExpanded
                      ? "rotate(180deg)"
                      : "rotate(0)",
                    transition: "transform 0.18s ease",
                  }}
                >
                  <ChevronDownIcon />
                </span>
              </span>
              <span style={sectionRuleStyle} role="presentation" />
            </button>

            {otherPagesExpanded && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {otherPageGroups.map(([path, items]) => (
                  <div key={path}>
                    <div
                      style={{
                        fontSize: 12,
                        color: THEME.textMuted,
                        margin: "6px 2px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {path}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {items.map((item) => (
                        <FeedbackCard
                          key={item.id}
                          item={item}
                          onSelect={selectOtherPageItem}
                          className={classNames.panelCard}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {config.branding && (
        <div
          style={{
            padding: "8px 20px",
            borderTop: `1px solid ${THEME.ring}`,
            textAlign: "center",
            fontSize: 11,
            flexShrink: 0,
          }}
        >
          <a
            href="https://faster-fixes.com?ref=widget"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: THEME.textMuted, textDecoration: "none" }}
          >
            Powered by FasterFixes
          </a>
        </div>
      )}
    </div>
  );
}
