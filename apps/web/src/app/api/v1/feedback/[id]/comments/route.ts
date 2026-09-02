import { checkRateLimit } from "@/server/api/check-rate-limit";
import {
  AttachmentTypeError,
  ATTACHMENT_ASSET_SELECT,
  mapAttachment,
  uploadFeedbackAttachment,
  validateAttachmentFiles,
} from "@/server/api/feedback-attachments";
import { resolveProject } from "@/server/api/resolve-project";
import { validateOrigin } from "@/server/api/validate-origin";
import { validateReviewer } from "@/server/api/validate-reviewer";
import { inngest } from "@/server/inngest";
import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const CreateCommentSchema = z.object({
  body: z.string().trim().min(1),
});

const COMMENT_INCLUDE = {
  member: { select: { id: true, user: { select: { name: true } } } },
  reviewer: { select: { id: true, name: true } },
  attachments: { include: { asset: { select: ATTACHMENT_ASSET_SELECT } } },
} as const;

type CommentWithRelations = {
  id: string;
  body: string;
  authorType: string;
  createdAt: Date;
  member: { id: string; user: { name: string } } | null;
  reviewer: { id: string; name: string } | null;
  attachments: Parameters<typeof mapAttachment>[0][];
};

async function mapComment(comment: CommentWithRelations) {
  // author is null when the member left the org (memberId SetNull) — the
  // widget renders its "Former member" label for that case.
  const author =
    comment.authorType === "member"
      ? comment.member
        ? { id: comment.member.id, name: comment.member.user.name }
        : null
      : comment.reviewer
        ? { id: comment.reviewer.id, name: comment.reviewer.name }
        : null;

  return {
    id: comment.id,
    body: comment.body,
    authorType: comment.authorType,
    author,
    createdAt: comment.createdAt,
    attachments: await Promise.all(comment.attachments.map(mapAttachment)),
  };
}

type RouteAuth = {
  project: { id: string };
  reviewer: { id: string };
  feedback: { id: string };
};

async function authenticate(
  req: NextRequest,
  feedbackId: string,
  rateAction: "read" | "submit",
): Promise<RouteAuth | NextResponse> {
  const project = await resolveProject(req.headers.get("x-api-key"));
  if (!project) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!validateOrigin(req.headers, project.domain)) {
    return NextResponse.json({ error: "Origin not allowed" }, { status: 403 });
  }
  const reviewer = await validateReviewer(
    req.headers.get("x-reviewer-token"),
    project.id,
  );
  if (!reviewer) {
    return NextResponse.json(
      { error: "Invalid reviewer token" },
      { status: 403 },
    );
  }
  const { allowed } = await checkRateLimit(project.id, rateAction);
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 },
    );
  }
  const feedback = await prisma.feedback.findFirst({
    where: { id: feedbackId, projectId: project.id },
    select: { id: true },
  });
  if (!feedback) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return { project, reviewer, feedback };
}

// GET /api/v1/feedback/[id]/comments — full thread for one feedback item.
// Reviewers see all comments of the project's feedback, same trust boundary
// as the feedback list itself.
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await authenticate(req, id, "read");
  if (auth instanceof NextResponse) return auth;

  const comments = await prisma.feedbackComment.findMany({
    where: { feedbackId: id },
    orderBy: { createdAt: "asc" },
    include: COMMENT_INCLUDE,
  });

  return NextResponse.json({
    comments: await Promise.all(comments.map(mapComment)),
  });
}

// POST /api/v1/feedback/[id]/comments — reviewer reply (multipart: data JSON
// + optional attachments files)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const auth = await authenticate(req, id, "submit");
  if (auth instanceof NextResponse) return auth;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const rawData = formData.get("data");
  if (typeof rawData !== "string") {
    return NextResponse.json({ error: "Missing data field" }, { status: 400 });
  }
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawData);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON in data field" },
      { status: 400 },
    );
  }
  const parsed = CreateCommentSchema.safeParse(parsedJson);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const files = formData
    .getAll("attachments")
    .filter((f): f is File => f instanceof File);
  const invalid = validateAttachmentFiles(files);
  if (invalid) {
    return NextResponse.json(
      { error: invalid.error },
      { status: invalid.status },
    );
  }

  let assetIds: string[];
  try {
    assetIds = (
      await Promise.all(
        files.map((file) =>
          uploadFeedbackAttachment({ file, projectId: auth.project.id }),
        ),
      )
    ).map((asset) => asset.id);
  } catch (err) {
    if (err instanceof AttachmentTypeError) {
      return NextResponse.json({ error: err.message }, { status: 422 });
    }
    console.error("[comments] attachment upload failed:", err);
    return NextResponse.json(
      { error: "Attachment upload failed" },
      { status: 500 },
    );
  }

  const comment = await prisma.feedbackComment.create({
    data: {
      feedbackId: id,
      authorType: "reviewer",
      reviewerId: auth.reviewer.id,
      body: parsed.data.body,
      attachments: {
        create: assetIds.map((assetId) => ({ assetId })),
      },
    },
    include: COMMENT_INCLUDE,
  });

  inngest
    .send({
      name: "feedback/comment-created",
      data: { feedbackId: id, commentId: comment.id, authorType: "reviewer" },
    })
    .catch(() => {});

  return NextResponse.json(await mapComment(comment), { status: 201 });
}
