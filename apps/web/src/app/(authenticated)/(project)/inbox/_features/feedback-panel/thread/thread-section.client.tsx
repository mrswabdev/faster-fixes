"use client";

import { useTRPC } from "@/lib/trpc/trpc-client";
import { useUploadFiles } from "@better-upload/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Textarea } from "@workspace/ui/components/textarea";
import { formatDistanceToNow } from "date-fns";
import { Loader2, Paperclip, X } from "lucide-react";
import { useRef, useState } from "react";

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "application/pdf",
] as const;
const MAX_FILES = 4;
const MAX_SIZE = 10 * 1024 * 1024;

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type ThreadSectionProps = {
  feedbackId: string;
};

export function ThreadSection({ feedbackId }: ThreadSectionProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const commentsQuery = useQuery(
    trpc.authenticated.projects.feedback.comments.list.queryOptions({
      feedbackId,
    }),
  );

  const { upload, isPending: isUploading } = useUploadFiles({
    route: "feedback-attachment",
  });

  const createComment = useMutation(
    trpc.authenticated.projects.feedback.comments.create.mutationOptions({
      onSuccess: () => {
        setBody("");
        setFiles([]);
        void queryClient.invalidateQueries({
          queryKey: trpc.authenticated.projects.feedback.comments.list.queryKey(
            { feedbackId },
          ),
        });
        // Comment counts in the inbox list stay in sync
        void queryClient.invalidateQueries({
          queryKey: trpc.authenticated.projects.feedback.list.queryKey(),
        });
      },
    }),
  );

  const isBusy = isUploading || createComment.isPending;

  function addFiles(picked: FileList | null) {
    if (!picked) return;
    setFileError(null);
    const next = [...files];
    for (const file of Array.from(picked)) {
      if (next.length >= MAX_FILES) {
        setFileError(`Maximal ${MAX_FILES} Dateien pro Antwort`);
        break;
      }
      if (!(ALLOWED_TYPES as readonly string[]).includes(file.type)) {
        setFileError("Nur Bilder und PDF sind erlaubt");
        continue;
      }
      if (file.size > MAX_SIZE) {
        setFileError("Datei zu groß (max. 10 MB)");
        continue;
      }
      next.push(file);
    }
    setFiles(next);
  }

  async function handleSend() {
    if (!body.trim() || isBusy) return;
    setFileError(null);

    let attachments: {
      key: string;
      filename: string;
      mimeType:
        | "image/png"
        | "image/jpeg"
        | "image/webp"
        | "image/gif"
        | "application/pdf";
      size: number;
    }[] = [];

    // Files upload lazily on send so an abandoned draft leaves no orphans.
    if (files.length > 0) {
      const result = await upload(files, { metadata: { feedbackId } });
      if (result.failedFiles.length > 0) {
        setFileError("Einige Anhänge konnten nicht hochgeladen werden. Bitte erneut versuchen.");
        return;
      }
      attachments = result.files.map((f) => ({
        key: f.objectInfo.key,
        filename: f.name.slice(0, 140),
        mimeType: f.type as (typeof attachments)[number]["mimeType"],
        size: f.size,
      }));
    }

    createComment.mutate({ feedbackId, body: body.trim(), attachments });
  }

  const comments = commentsQuery.data ?? [];

  return (
    <div>
      <h4 className="text-muted-foreground mb-2 text-xs font-medium uppercase">
        Antworten
      </h4>

      {commentsQuery.isLoading ? (
        <div className="text-muted-foreground flex items-center gap-2 py-2 text-xs">
          <Loader2 className="size-3.5 animate-spin" /> Antworten werden geladen…
        </div>
      ) : comments.length === 0 ? (
        <p className="text-muted-foreground py-1 text-xs">Noch keine Antworten.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-muted/50 rounded-md p-3">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-xs font-semibold">
                  {comment.authorName ??
                    (comment.authorType === "member"
                      ? "Ehemaliges Mitglied"
                      : "Reviewer")}
                </span>
                <Badge
                  variant={
                    comment.authorType === "member" ? "default" : "secondary"
                  }
                  className="px-1.5 py-0 text-[10px]"
                >
                  {comment.authorType === "member" ? "Team" : "Reviewer"}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {comment.body}
              </p>
              {comment.attachments.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {comment.attachments.map((attachment) =>
                    attachment.mimeType.startsWith("image/") ? (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={attachment.url}
                          alt={attachment.filename}
                          className="size-16 rounded-md border object-cover"
                        />
                      </a>
                    ) : (
                      <a
                        key={attachment.id}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary inline-flex items-center gap-1 text-xs underline underline-offset-2"
                      >
                        <Paperclip className="size-3" />
                        {attachment.filename} ({formatSize(attachment.size)})
                      </a>
                    ),
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Composer */}
      <div className="mt-3 flex flex-col gap-2">
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Dem Reviewer antworten…"
          rows={2}
          disabled={isBusy}
        />
        {files.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {files.map((file, i) => (
              <span
                key={`${file.name}-${i}`}
                className="bg-muted inline-flex max-w-full items-center gap-1 rounded-md px-2 py-0.5 text-xs"
              >
                <span className="max-w-36 truncate">{file.name}</span>
                <span className="text-muted-foreground shrink-0">
                  {formatSize(file.size)}
                </span>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() =>
                    setFiles((prev) => prev.filter((_, idx) => idx !== i))
                  }
                  disabled={isBusy}
                  aria-label={`${file.name} entfernen`}
                >
                  <X className="size-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {fileError && <p className="text-destructive text-xs">{fileError}</p>}
        {createComment.isError && (
          <p className="text-destructive text-xs">
            {createComment.error.message}
          </p>
        )}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isBusy}
          >
            <Paperclip className="size-4" />
            Dateien anhängen
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".png,.jpg,.jpeg,.webp,.gif,.pdf"
            hidden
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            size="sm"
            onClick={() => void handleSend()}
            disabled={isBusy || !body.trim()}
          >
            {isBusy && <Loader2 className="size-4 animate-spin" />}
            Antworten
          </Button>
        </div>
      </div>
    </div>
  );
}
