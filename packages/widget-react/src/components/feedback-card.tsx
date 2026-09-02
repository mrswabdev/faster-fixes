import type { FeedbackItem, FeedbackStatus } from "@fasterfixes/core";
import { STATUS_COLORS } from "@fasterfixes/core";
import { cardMetaStyle, cardStyle, THEME } from "../styles.js";
import { ClockIcon, CommentBubbleIcon, PaperclipIcon } from "./widget-icons.js";

// "just now" / "5m" / "3h" / "5d" / "2w" — coarse buckets are enough for a
// review context; exact timestamps live in the dashboard.
function formatAge(createdAt: string): string {
  const seconds = (Date.now() - new Date(createdAt).getTime()) / 1000;
  if (!Number.isFinite(seconds) || seconds < 60) return "just now";
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)}m`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}h`;
  const days = hours / 24;
  if (days < 14) return `${Math.floor(days)}d`;
  return `${Math.floor(days / 7)}w`;
}

type FeedbackCardProps = {
  item: FeedbackItem;
  onSelect: (item: FeedbackItem) => void;
  className?: string;
};

export function FeedbackCard({ item, onSelect, className }: FeedbackCardProps) {
  const statusColor =
    STATUS_COLORS[item.status as FeedbackStatus] ?? STATUS_COLORS.new;

  return (
    <button
      type="button"
      className={`ff-card ff-widget-focusable ${className ?? ""}`}
      style={{
        ...cardStyle,
        display: "block",
        width: "100%",
        textAlign: "left",
        fontFamily: "inherit",
        fontSize: "inherit",
      }}
      onClick={() => onSelect(item)}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 6,
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: statusColor,
            flexShrink: 0,
          }}
          role="presentation"
        />
        <span style={{ fontWeight: 600, color: THEME.text }}>
          {item.reviewer.name}
        </span>
      </div>
      <p
        style={{
          margin: 0,
          color: "#374151",
          lineHeight: 1.45,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {item.comment}
      </p>
      <div style={cardMetaStyle}>
        {(item.attachments?.length ?? 0) > 0 && (
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            <PaperclipIcon size={14} />
          </span>
        )}
        {(item.commentCount ?? 0) > 0 && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
            <CommentBubbleIcon />
            {item.commentCount}
          </span>
        )}
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <ClockIcon />
          {formatAge(item.createdAt)}
        </span>
      </div>
    </button>
  );
}
