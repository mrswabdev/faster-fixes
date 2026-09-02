import { checkRateLimit } from "@/server/api/check-rate-limit";
import { ATTACHMENT_ASSET_SELECT, mapAttachment } from "@/server/api/feedback-attachments";
import { resolveProject } from "@/server/api/resolve-project";
import { validateOrigin } from "@/server/api/validate-origin";
import { validateReviewer } from "@/server/api/validate-reviewer";
import { prisma } from "@workspace/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpdateCommentSchema = z.object({
  body: z.string().trim().min(1),
});

type Params = { params: Promise<{ id: string; commentId: string }> };

// Reviewers may only touch their own comments — stricter than the legacy
// feedback PUT/DELETE on purpose; ownership is part of the where clause so
// foreign comments 404 instead of leaking existence.
async function findOwnComment(
  req: NextRequest,
  feedbackId: string,
  commentId: string,
) {
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
  const { allowed } = await checkRateLimit(project.id, "submit");
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429 },
    );
  }

  const comment = await prisma.feedbackComment.findFirst({
    where: {
      id: commentId,
      feedbackId,
      reviewerId: reviewer.id,
      feedback: { projectId: project.id },
    },
    select: { id: true },
  });
  if (!comment) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return comment;
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id, commentId } = await params;
  const own = await findOwnComment(req, id, commentId);
  if (own instanceof NextResponse) return own;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = UpdateCommentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const updated = await prisma.feedbackComment.update({
    where: { id: commentId },
    data: { body: parsed.data.body },
    include: {
      reviewer: { select: { id: true, name: true } },
      attachments: { include: { asset: { select: ATTACHMENT_ASSET_SELECT } } },
    },
  });

  return NextResponse.json({
    id: updated.id,
    body: updated.body,
    authorType: updated.authorType,
    author: updated.reviewer
      ? { id: updated.reviewer.id, name: updated.reviewer.name }
      : null,
    createdAt: updated.createdAt,
    attachments: await Promise.all(updated.attachments.map(mapAttachment)),
  });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id, commentId } = await params;
  const own = await findOwnComment(req, id, commentId);
  if (own instanceof NextResponse) return own;

  await prisma.feedbackComment.delete({ where: { id: commentId } });
  return new NextResponse(null, { status: 204 });
}
