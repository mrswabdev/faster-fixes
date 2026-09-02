import { createContext, useContext } from "react";
import type {
  DiagnosticTrail,
  FeedbackClient,
  FeedbackItem,
  Labels,
  WidgetConfig,
  WidgetPosition,
} from "@fasterfixes/core";

export type WidgetMode =
  | "idle"
  | "annotating"
  | "selected"
  | "submitting"
  | "success"
  | "error";

export type ClassNames = {
  button?: string;
  popover?: string;
  textarea?: string;
  pin?: string;
  overlay?: string;
  successState?: string;
  errorState?: string;
  feedbackList?: string;
  feedbackListItem?: string;
  toolbar?: string;
  panel?: string;
  panelCard?: string;
};

export type PanelTab = "open" | "resolved";

export type FeedbackContextValue = {
  // Core
  client: FeedbackClient;
  reviewerToken: string;
  config: WidgetConfig;

  // Widget state
  mode: WidgetMode;
  setMode: (mode: WidgetMode) => void;
  isVisible: boolean;
  show: () => void;
  hide: () => void;

  // Feedback data
  feedbackItems: FeedbackItem[];
  refreshFeedback: () => Promise<void>;
  getDiagnosticTrail: () => DiagnosticTrail | undefined;

  // Selection state
  selectedElement: Element | null;
  setSelectedElement: (el: Element | null) => void;
  clickCoords: { x: number; y: number } | null;
  setClickCoords: (coords: { x: number; y: number } | null) => void;
  screenshotBlob: Blob | null;
  setScreenshotBlob: (blob: Blob | null) => void;
  screenshotCaptureRef: React.RefObject<Promise<Blob | null> | null>;

  // Active pin (for viewing/editing existing feedback)
  activeFeedback: FeedbackItem | null;
  setActiveFeedback: (item: FeedbackItem | null) => void;

  // Panel tab: drives both the sheet's list and which pins render
  panelTab: PanelTab;
  setPanelTab: (tab: PanelTab) => void;

  // Legacy aliases kept so the retired FloatingButton/FeedbackList (still
  // type-checked, no longer rendered) and upstream code keep compiling:
  // showResolved mirrors panelTab, showList mirrors panelOpen.
  showResolved: boolean;
  setShowResolved: (show: boolean) => void;
  showList: boolean;
  setShowList: (show: boolean) => void;

  // Element highlight (hover/active pin)
  highlightSelector: string | null;
  setHighlightSelector: (selector: string | null) => void;

  // Toolbar toggles
  showPins: boolean;
  setShowPins: (show: boolean) => void;
  panelOpen: boolean;
  setPanelOpen: (open: boolean) => void;

  // Customization
  classNames: ClassNames;
  labels: Labels;
  position: WidgetPosition;
  color: string;
};

export const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export function useFeedbackContext() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    throw new Error("useFeedbackContext must be used within a FeedbackProvider");
  }
  return ctx;
}
