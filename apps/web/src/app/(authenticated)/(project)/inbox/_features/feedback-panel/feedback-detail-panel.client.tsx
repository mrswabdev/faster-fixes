"use client";

import { Separator } from "@workspace/ui/components/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { format, formatDistanceToNow } from "date-fns";
import { ExternalLink, ImageOff, Paperclip } from "lucide-react";
import type { GetFeedbackOutput } from "../get-feedback.trpc.query";
import { ThreadSection } from "./thread/thread-section.client";
import { AssigneeSelect } from "./assignee-select.client";
import { CopyFeedbackMarkdown } from "./copy-feedback-markdown.client";
import { ScreenshotDialog } from "./screenshot-dialog.client";
import { StatusSelect } from "./status-select.client";
import { TrackersSection } from "./trackers-section.client";
import { ViewDiagnosticsDialog } from "./view-diagnostics-dialog.client";

type FeedbackItem = GetFeedbackOutput[number];

type FeedbackDetailPanelProps = {
  feedback: FeedbackItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  hasGitHubLink?: boolean;
  hasLinearLink?: boolean;
  hasJiraLink?: boolean;
};

function formatBrowserMeta(f: FeedbackItem) {
  const parts: string[] = [];
  if (f.browserName) {
    parts.push(
      f.browserVersion ? `${f.browserName} ${f.browserVersion}` : f.browserName,
    );
  }
  if (f.os) parts.push(f.os);
  if (f.viewportWidth && f.viewportHeight) {
    parts.push(`${f.viewportWidth}\u00d7${f.viewportHeight}`);
  }
  return parts.join(" \u00b7 ");
}

export function FeedbackDetailPanel({
  feedback,
  open,
  onOpenChange,
  projectId,
  hasGitHubLink = false,
  hasLinearLink = false,
  hasJiraLink = false,
}: FeedbackDetailPanelProps) {
  if (!feedback) return null;

  const browserMeta = formatBrowserMeta(feedback);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="sr-only">Feedback-Details</SheetTitle>
          <SheetDescription className="sr-only">
            Feedback-Details ansehen und verwalten
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-6 p-4 pt-0">
          {/* Page URL */}
          <div className="flex items-center justify-between gap-2">
            <a
              href={feedback.pageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary inline-flex min-w-0 items-center gap-1.5 text-sm font-medium hover:underline"
            >
              <span className="truncate">{feedback.pageUrl}</span>
              <ExternalLink className="size-3.5 shrink-0" />
            </a>
            <CopyFeedbackMarkdown feedback={feedback} />
          </div>

          {/* Comment */}
          <div>
            <h4 className="text-muted-foreground mb-1 text-xs font-medium uppercase">
              Kommentar
            </h4>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {feedback.comment}
            </p>
            {feedback.attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {feedback.attachments.map((attachment) =>
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
                      {attachment.filename}
                    </a>
                  ),
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Reply thread */}
          <ThreadSection feedbackId={feedback.id} />

          <Separator />

          {/* Screenshot */}
          <div>
            <h4 className="text-muted-foreground mb-2 text-xs font-medium uppercase">
              Screenshot
            </h4>
            {feedback.screenshotUrl ? (
              <div className="flex flex-col gap-2">
                <ScreenshotDialog src={feedback.screenshotUrl} />
                <div className="text-muted-foreground flex flex-col gap-0.5 text-xs">
                  {feedback.clickX != null && feedback.clickY != null && (
                    <span>
                      Klick: ({Math.round(feedback.clickX)},{" "}
                      {Math.round(feedback.clickY)})
                    </span>
                  )}
                  {feedback.selector && (
                    <span>Selektor: {feedback.selector}</span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-muted-foreground flex flex-col items-center gap-2 rounded-md border border-dashed py-8">
                <ImageOff className="size-8 opacity-50" />
                <span className="text-xs">Kein Screenshot vorhanden</span>
              </div>
            )}
          </div>

          {/* Element context from metadata */}
          {feedback.metadata &&
            (() => {
              const md = feedback.metadata as Record<string, unknown>;
              const hasContext =
                md.elementDescription ||
                md.reactComponentPath ||
                md.sourceFile;
              if (!hasContext) return null;
              return (
                <>
                  <Separator />
                  <div>
                    <h4 className="text-muted-foreground mb-1 text-xs font-medium uppercase">
                      Element
                    </h4>
                    <div className="flex flex-col gap-1 text-sm">
                      {typeof md.elementDescription === "string" && (
                        <p>{md.elementDescription}</p>
                      )}
                      {typeof md.reactComponentPath === "string" && (
                        <p className="text-muted-foreground font-mono text-xs">
                          {md.reactComponentPath}
                        </p>
                      )}
                      {typeof md.sourceFile === "string" && (
                        <p className="text-muted-foreground font-mono text-xs">
                          {md.sourceFile}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              );
            })()}

          {/* Browser Metadata */}
          {browserMeta && (
            <>
              <Separator />
              <div>
                <h4 className="text-muted-foreground mb-1 text-xs font-medium uppercase">
                  Browser
                </h4>
                <p className="text-sm">{browserMeta}</p>
              </div>
            </>
          )}

          <Separator />

          {/* Diagnostics */}
          <div>
            <h4 className="text-muted-foreground mb-2 text-xs font-medium uppercase">
              Diagnose
            </h4>
            <ViewDiagnosticsDialog
              projectId={projectId}
              feedbackId={feedback.id}
            />
          </div>

          <Separator />

          <StatusSelect
            feedbackId={feedback.id}
            value={feedback.status}
          />

          <TrackersSection
            feedbackId={feedback.id}
            projectId={projectId}
            hasGitHubLink={hasGitHubLink}
            hasLinearLink={hasLinearLink}
            hasJiraLink={hasJiraLink}
            githubIssueLink={feedback.issueLink}
            linearIssueLink={feedback.linearIssueLink}
            jiraIssueLink={feedback.jiraIssueLink}
          />

          <AssigneeSelect
            feedbackId={feedback.id}
            value={feedback.assignee?.id ?? null}
          />

          <Separator />

          {/* Timestamps */}
          <div className="text-muted-foreground flex flex-col gap-1 text-xs">
            <span>
              Eingereicht von {feedback.reviewer.name} am{" "}
              {format(new Date(feedback.createdAt), "MMM d, yyyy")}
            </span>
            <span>
              Zuletzt aktualisiert{" "}
              {formatDistanceToNow(new Date(feedback.updatedAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
