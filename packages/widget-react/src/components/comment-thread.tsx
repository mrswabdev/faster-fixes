import { useEffect, useState } from "react";
import type { FeedbackCommentItem } from "@fasterfixes/core";
import { useFeedbackContext } from "../context.js";
import {
  composerRowStyle,
  iconOnlyButtonStyle,
  teamBadgeStyle,
  textareaStyle,
  THEME,
  threadBubbleStyle,
  threadMetaStyle,
} from "../styles.js";
import { AttachmentList } from "./attachment-list.js";
import {
  AttachmentButton,
  AttachmentChips,
  useAttachmentPicker,
} from "./attachment-picker.js";
import { SendIcon } from "./widget-icons.js";

function formatAge(createdAt: string): string {
  const seconds = (Date.now() - new Date(createdAt).getTime()) / 1000;
  if (!Number.isFinite(seconds) || seconds < 60) return "just now";
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.floor(minutes)}m`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}h`;
  return `${Math.floor(hours / 24)}d`;
}

type CommentThreadProps = {
  feedbackId: string;
};

/**
 * Reply thread below an existing feedback item. Loads lazily when the pin
 * popover opens; local state only, so the widget context stays untouched.
 */
export function CommentThread({ feedbackId }: CommentThreadProps) {
  const { client, reviewerToken, labels, refreshFeedback } =
    useFeedbackContext();

  const [comments, setComments] = useState<FeedbackCommentItem[] | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const picker = useAttachmentPicker(labels);

  useEffect(() => {
    let cancelled = false;
    setComments(null);
    client
      .getComments(feedbackId, reviewerToken)
      .then((res) => {
        if (!cancelled) setComments(res.comments);
      })
      .catch(() => {
        if (!cancelled) setComments([]);
      });
    return () => {
      cancelled = true;
    };
  }, [client, feedbackId, reviewerToken]);

  async function handleSend() {
    if (!reply.trim() || sending) return;
    setSending(true);
    setError(null);
    try {
      const created = await client.createComment(
        feedbackId,
        { body: reply.trim() },
        reviewerToken,
        picker.files,
      );
      setComments((prev) => [...(prev ?? []), created]);
      setReply("");
      picker.reset();
      // Comment counts on the cards come from the feedback list
      void refreshFeedback();
    } catch (err) {
      setError(err instanceof Error ? err.message : labels.errorMessage);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ marginTop: 12, borderTop: `1px solid ${THEME.ring}`, paddingTop: 10 }}>
      {comments === null ? (
        <p style={{ margin: 0, fontSize: 12, color: THEME.textMuted }}>…</p>
      ) : comments.length === 0 ? (
        <p style={{ margin: 0, fontSize: 12, color: THEME.textMuted }}>
          {labels.noReplies}
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            maxHeight: 220,
            overflowY: "auto",
          }}
          className="ff-panel-scroll"
        >
          {comments.map((c) => (
            <div key={c.id}>
              <div style={threadMetaStyle}>
                <span style={{ fontWeight: 600, color: THEME.text }}>
                  {c.author?.name ?? labels.formerMember}
                </span>
                {c.authorType === "member" && (
                  <span style={teamBadgeStyle}>{labels.teamBadge}</span>
                )}
                <span>{formatAge(c.createdAt)}</span>
              </div>
              <div style={threadBubbleStyle(c.authorType === "reviewer")}>
                <span style={{ whiteSpace: "pre-wrap" }}>{c.body}</span>
                <AttachmentList attachments={c.attachments} />
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={composerRowStyle}>
        <textarea
          style={{ ...textareaStyle, minHeight: 34, fontSize: 13 }}
          placeholder={labels.replyPlaceholder}
          value={reply}
          rows={1}
          onChange={(e) => setReply(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
          disabled={sending}
        />
        <AttachmentButton picker={picker} labels={labels} disabled={sending} />
        <button
          type="button"
          className="ff-panel-icon-btn ff-widget-focusable"
          style={{
            ...iconOnlyButtonStyle,
            color: reply.trim() ? "var(--ff-accent)" : THEME.textMuted,
          }}
          onClick={() => void handleSend()}
          disabled={sending || !reply.trim()}
          aria-label={labels.replyButton}
          title={labels.replyButton}
        >
          <SendIcon />
        </button>
      </div>
      <AttachmentChips picker={picker} disabled={sending} />
      {error && (
        <p style={{ margin: "6px 0 0", color: THEME.danger, fontSize: 12 }}>
          {error}
        </p>
      )}
    </div>
  );
}
