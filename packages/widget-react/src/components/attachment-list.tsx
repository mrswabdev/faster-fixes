import type { FeedbackAttachmentItem } from "@fasterfixes/core";
import { attachmentLinkStyle, attachmentThumbStyle } from "../styles.js";
import { PaperclipIcon } from "./widget-icons.js";

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type AttachmentListProps = {
  attachments: FeedbackAttachmentItem[];
};

/** Read-only rendering: images as thumbnails, PDFs as download links. */
export function AttachmentList({ attachments }: AttachmentListProps) {
  if (attachments.length === 0) return null;

  const images = attachments.filter((a) => a.mimeType.startsWith("image/"));
  const others = attachments.filter((a) => !a.mimeType.startsWith("image/"));

  return (
    <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
      {images.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {images.map((a) => (
            <a
              key={a.id}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={a.filename}
            >
              <img src={a.url} alt={a.filename} style={attachmentThumbStyle} />
            </a>
          ))}
        </div>
      )}
      {others.map((a) => (
        <a
          key={a.id}
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          style={attachmentLinkStyle}
        >
          <PaperclipIcon size={13} />
          {a.filename} ({formatSize(a.size)})
        </a>
      ))}
    </div>
  );
}
