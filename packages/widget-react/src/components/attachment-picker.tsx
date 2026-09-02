import { useRef, useState } from "react";
import {
  ALLOWED_ATTACHMENT_TYPES,
  MAX_ATTACHMENT_SIZE,
  MAX_ATTACHMENTS_PER_MESSAGE,
} from "@fasterfixes/core";
import type { Labels } from "@fasterfixes/core";
import {
  attachmentChipStyle,
  iconOnlyButtonStyle,
  THEME,
} from "../styles.js";
import { CloseIcon, PaperclipIcon } from "./widget-icons.js";
import { compressImage } from "../utils/compress-image.js";

const ACCEPT = ".png,.jpg,.jpeg,.webp,.gif,.pdf";

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function useAttachmentPicker(labels: Labels) {
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  async function addFiles(picked: FileList | null) {
    if (!picked) return;
    setFileError(null);
    const next = [...files];
    for (const raw of Array.from(picked)) {
      if (next.length >= MAX_ATTACHMENTS_PER_MESSAGE) {
        setFileError(labels.attachmentTooMany);
        break;
      }
      if (
        !(ALLOWED_ATTACHMENT_TYPES as readonly string[]).includes(raw.type)
      ) {
        setFileError(labels.attachmentWrongType);
        continue;
      }
      const file = await compressImage(raw);
      if (file.size > MAX_ATTACHMENT_SIZE) {
        setFileError(labels.attachmentTooLarge);
        continue;
      }
      next.push(file);
    }
    setFiles(next);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  }

  function reset() {
    setFiles([]);
    setFileError(null);
  }

  return { files, fileError, addFiles, removeFile, reset };
}

type AttachmentPickerProps = {
  picker: ReturnType<typeof useAttachmentPicker>;
  labels: Labels;
  disabled?: boolean;
};

/** Paperclip trigger button — place inline next to other composer controls. */
export function AttachmentButton({ picker, labels, disabled }: AttachmentPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <button
        type="button"
        className="ff-panel-icon-btn ff-widget-focusable"
        style={iconOnlyButtonStyle}
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        aria-label={labels.attachButton}
        title={labels.attachButton}
      >
        <PaperclipIcon />
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT}
        hidden
        onChange={(e) => {
          void picker.addFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </>
  );
}

/** Selected-file chips plus the validation error line. */
export function AttachmentChips({ picker, disabled }: Omit<AttachmentPickerProps, "labels">) {
  if (picker.files.length === 0 && !picker.fileError) return null;
  return (
    <div style={{ marginTop: 6 }}>
      {picker.files.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {picker.files.map((file, i) => (
            <span key={`${file.name}-${i}`} style={attachmentChipStyle}>
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 140,
                }}
              >
                {file.name}
              </span>
              <span style={{ color: THEME.textMuted, flexShrink: 0 }}>
                {formatSize(file.size)}
              </span>
              <button
                type="button"
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  color: THEME.textMuted,
                }}
                onClick={() => picker.removeFile(i)}
                disabled={disabled}
                aria-label={`Remove ${file.name}`}
              >
                <CloseIcon size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      {picker.fileError && (
        <p style={{ margin: "6px 0 0", color: THEME.danger, fontSize: 12 }}>
          {picker.fileError}
        </p>
      )}
    </div>
  );
}
