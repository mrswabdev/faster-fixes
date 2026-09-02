export type WidgetPosition =
  | "bottom-right"
  | "bottom-left"
  | "top-right"
  | "top-left"
  | "middle-right"
  | "middle-left";

export type FeedbackStatus = "new" | "in_progress" | "resolved" | "closed";

export type WidgetConfig = {
  enabled: boolean;
  branding: boolean;
};

export type FeedbackReviewer = {
  id: string;
  name: string;
};

export type FeedbackAttachmentItem = {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
};

export type FeedbackCommentAuthorType = "member" | "reviewer";

export type FeedbackCommentItem = {
  id: string;
  body: string;
  authorType: FeedbackCommentAuthorType;
  // null when the authoring member has left the organization
  author: { id: string; name: string } | null;
  createdAt: string;
  attachments: FeedbackAttachmentItem[];
};

export type CommentListResponse = {
  comments: FeedbackCommentItem[];
};

export type CreateCommentData = {
  body: string;
};

export type FeedbackItem = {
  id: string;
  status: FeedbackStatus;
  comment: string;
  pageUrl: string;
  clickX: number | null;
  clickY: number | null;
  selector: string | null;
  screenshotUrl: string | null;
  reviewer: FeedbackReviewer;
  createdAt: string;
  metadata?: Record<string, unknown> | null;
  // Optional so alternative FeedbackClient implementations and older API
  // responses keep compiling/working.
  commentCount?: number;
  attachments?: FeedbackAttachmentItem[];
};

export type FeedbackListResponse = {
  feedback: FeedbackItem[];
};

export type ConsoleLevel = "log" | "info" | "warn" | "error" | "debug";

export type ConsoleEntry = {
  level: ConsoleLevel;
  message: string;
  timestamp: number;
};

export type NetworkEntry = {
  method: string;
  url: string;
  status: number;
  duration: number;
  timestamp: number;
};

export type DiagnosticTrail = {
  console: ConsoleEntry[];
  network: NetworkEntry[];
};

export type CreateFeedbackData = {
  comment: string;
  pageUrl: string;
  selector?: string;
  clickX?: number;
  clickY?: number;
  browserName?: string;
  browserVersion?: string;
  os?: string;
  viewportWidth?: number;
  viewportHeight?: number;
  metadata?: Record<string, unknown>;
  diagnosticTrail?: DiagnosticTrail;
};

export type UpdateFeedbackData = {
  comment: string;
};

export type CreateFeedbackResponse = FeedbackItem;

export type UpdateFeedbackResponse = {
  id: string;
  comment: string;
  updatedAt: string;
};

export type ApiErrorResponse = {
  error: string;
  details?: unknown;
};

/**
 * Common shape implemented by any feedback backend. The default
 * implementation is `FasterFixesClient` (HTTP against the hosted API);
 * alternative implementations can target localStorage, in-memory state,
 * or a mock for tests.
 */
export interface FeedbackClient {
  getConfig(): Promise<WidgetConfig>;
  getFeedback(
    reviewerToken: string,
    url?: string,
  ): Promise<FeedbackListResponse>;
  createFeedback(
    data: CreateFeedbackData,
    reviewerToken: string,
    screenshot?: Blob,
    attachments?: File[],
  ): Promise<CreateFeedbackResponse>;
  updateFeedback(
    id: string,
    data: UpdateFeedbackData,
    reviewerToken: string,
  ): Promise<UpdateFeedbackResponse>;
  deleteFeedback(id: string, reviewerToken: string): Promise<void>;
  attachScreenshot(
    feedbackId: string,
    screenshot: Blob,
    reviewerToken: string,
  ): Promise<void>;
  getComments(
    feedbackId: string,
    reviewerToken: string,
  ): Promise<CommentListResponse>;
  createComment(
    feedbackId: string,
    data: CreateCommentData,
    reviewerToken: string,
    attachments?: File[],
  ): Promise<FeedbackCommentItem>;
  updateComment(
    feedbackId: string,
    commentId: string,
    data: CreateCommentData,
    reviewerToken: string,
  ): Promise<FeedbackCommentItem>;
  deleteComment(
    feedbackId: string,
    commentId: string,
    reviewerToken: string,
  ): Promise<void>;
}
