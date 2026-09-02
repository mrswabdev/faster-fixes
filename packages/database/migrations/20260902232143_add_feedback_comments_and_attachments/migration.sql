-- CreateTable
CREATE TABLE "feedback_comment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "authorType" TEXT NOT NULL,
    "memberId" TEXT,
    "reviewerId" TEXT,
    "body" TEXT NOT NULL,

    CONSTRAINT "feedback_comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_attachment" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedbackId" TEXT,
    "commentId" TEXT,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "feedback_attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feedback_comment_feedbackId_idx" ON "feedback_comment"("feedbackId");

-- CreateIndex
CREATE INDEX "feedback_attachment_feedbackId_idx" ON "feedback_attachment"("feedbackId");

-- CreateIndex
CREATE INDEX "feedback_attachment_commentId_idx" ON "feedback_attachment"("commentId");

-- AddForeignKey
ALTER TABLE "feedback_comment" ADD CONSTRAINT "feedback_comment_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_comment" ADD CONSTRAINT "feedback_comment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_comment" ADD CONSTRAINT "feedback_comment_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "reviewer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_attachment" ADD CONSTRAINT "feedback_attachment_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "feedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_attachment" ADD CONSTRAINT "feedback_attachment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "feedback_comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedback_attachment" ADD CONSTRAINT "feedback_attachment_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

