import {
  ALLOWED_ATTACHMENT_TYPES,
  MAX_ATTACHMENT_SIZE,
  MAX_ATTACHMENTS_PER_MESSAGE,
} from "@fasterfixes/core";
import { putObject } from "@better-upload/server/helpers";
import crypto from "crypto";
import { s3Client } from "@/server/storage";
import { createAsset } from "@/server/storage/create-asset";
import { getSignedAssetUrl } from "@/server/storage/get-signed-asset-url";

export { MAX_ATTACHMENTS_PER_MESSAGE };

const EXTENSION_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "application/pdf": "pdf",
};

// The declared Content-Type is attacker-controlled; the first bytes are not.
// Detection drives both validation and the stored mimeType/extension.
export function sniffMimeType(buffer: Buffer): string | null {
  if (buffer.length < 12) return null;
  if (buffer.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47])))
    return "image/png";
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])))
    return "image/jpeg";
  if (buffer.subarray(0, 4).toString("latin1") === "GIF8") return "image/gif";
  if (
    buffer.subarray(0, 4).toString("latin1") === "RIFF" &&
    buffer.subarray(8, 12).toString("latin1") === "WEBP"
  )
    return "image/webp";
  if (buffer.subarray(0, 5).toString("latin1") === "%PDF-")
    return "application/pdf";
  return null;
}

// Display-only cleanup: the storage key never contains user input.
export function sanitizeFilename(name: string): string {
  const cleaned = name
    .replace(/[/\\]/g, "_")
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1f\x7f]/g, "")
    .trim();
  return (cleaned || "attachment").slice(0, 140);
}

export type AttachmentValidationError = {
  error: string;
  status: number;
};

export function validateAttachmentFiles(
  files: File[],
): AttachmentValidationError | null {
  if (files.length > MAX_ATTACHMENTS_PER_MESSAGE) {
    return {
      error: `At most ${MAX_ATTACHMENTS_PER_MESSAGE} attachments per message`,
      status: 422,
    };
  }
  for (const file of files) {
    if (file.size > MAX_ATTACHMENT_SIZE) {
      return { error: "Attachment exceeds 10MB limit", status: 413 };
    }
  }
  return null;
}

/**
 * Validates (magic bytes), uploads to R2, and creates the Asset record for
 * one attachment. Throws on validation failure with a message safe to return.
 */
export async function uploadFeedbackAttachment({
  file,
  projectId,
  uploadedById,
}: {
  file: File;
  projectId: string;
  uploadedById?: string;
}) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffMimeType(buffer);
  if (
    !sniffed ||
    !(ALLOWED_ATTACHMENT_TYPES as readonly string[]).includes(sniffed)
  ) {
    throw new AttachmentTypeError();
  }

  const ext = EXTENSION_BY_MIME[sniffed];
  const key = `feedback-attachments/${projectId}/${crypto.randomUUID()}.${ext}`;
  const bucket = process.env.STORAGE_BUCKET_NAME!;

  await putObject(s3Client, {
    bucket,
    key,
    body: buffer,
    contentType: sniffed,
  });

  return createAsset({
    key,
    bucket,
    provider: "r2",
    filename: sanitizeFilename(file.name),
    mimeType: sniffed,
    size: buffer.length,
    uploadedById,
  });
}

export class AttachmentTypeError extends Error {
  constructor() {
    super("Attachment type not allowed. Allowed: PNG, JPEG, WebP, GIF, PDF");
    this.name = "AttachmentTypeError";
  }
}

type AttachmentWithAsset = {
  id: string;
  asset: {
    key: string;
    bucket: string;
    provider: string;
    filename: string;
    mimeType: string;
    size: number;
  };
};

export async function mapAttachment(attachment: AttachmentWithAsset) {
  return {
    id: attachment.id,
    filename: attachment.asset.filename,
    mimeType: attachment.asset.mimeType,
    size: attachment.asset.size,
    url: await getSignedAssetUrl(attachment.asset),
  };
}

export const ATTACHMENT_ASSET_SELECT = {
  key: true,
  bucket: true,
  provider: true,
  filename: true,
  mimeType: true,
  size: true,
} as const;
