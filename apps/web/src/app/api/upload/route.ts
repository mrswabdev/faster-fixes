import { auth } from "@/server/auth";
import { s3Client } from "@/server/storage";
import { RejectUpload, route, type Router } from "@better-upload/server";
import { toRouteHandler } from "@better-upload/server/adapters/next";
import { prisma } from "@workspace/db";
import { z } from "zod";

const router: Router = {
  client: s3Client,
  bucketName: process.env.STORAGE_BUCKET_NAME!,
  routes: {
    "organization-logo": route({
      fileTypes: ["image/png", "image/jpeg", "image/webp"],
      maxFileSize: 2 * 1024 * 1024,
      clientMetadataSchema: z.object({
        organizationId: z.string(),
      }),
      onBeforeUpload: async ({ req, file, clientMetadata }) => {
        const session = await auth.api.getSession({
          headers: req.headers,
        });

        if (!session) {
          throw new RejectUpload("Unauthorized");
        }

        const membership = await prisma.member.findFirst({
          where: {
            organizationId: clientMetadata.organizationId,
            userId: session.user.id,
            role: { in: ["owner", "admin"] },
          },
        });

        if (!membership) {
          throw new RejectUpload(
            "You do not have permission to modify this organization.",
          );
        }

        const extension = file.type.split("/")[1] ?? "png";

        return {
          objectInfo: {
            key: `organization-logos/${clientMetadata.organizationId}/${Date.now()}.${extension}`,
          },
        };
      },
    }),
    "feedback-attachment": route({
      fileTypes: [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/gif",
        "application/pdf",
      ],
      maxFileSize: 10 * 1024 * 1024,
      multipleFiles: true,
      maxFiles: 4,
      clientMetadataSchema: z.object({
        feedbackId: z.string(),
      }),
      onBeforeUpload: async ({ req, clientMetadata }) => {
        const session = await auth.api.getSession({
          headers: req.headers,
        });
        if (!session) {
          throw new RejectUpload("Unauthorized");
        }

        const feedback = await prisma.feedback.findFirst({
          where: {
            id: clientMetadata.feedbackId,
            project: {
              organization: {
                members: { some: { userId: session.user.id } },
              },
            },
          },
          select: { projectId: true },
        });
        if (!feedback) {
          throw new RejectUpload(
            "You do not have permission to reply to this feedback.",
          );
        }

        return {
          // The tRPC mutation later verifies this exact prefix before
          // registering the asset, so uploads and records stay in lockstep.
          generateObjectInfo: ({ file }) => {
            const extension =
              file.type === "application/pdf"
                ? "pdf"
                : (file.type.split("/")[1] ?? "png");
            return {
              key: `feedback-attachments/${feedback.projectId}/${crypto.randomUUID()}.${extension}`,
            };
          },
        };
      },
    }),
    "user-avatar": route({
      fileTypes: ["image/png", "image/jpeg", "image/webp"],
      maxFileSize: 2 * 1024 * 1024,
      onBeforeUpload: async ({ req, file }) => {
        const session = await auth.api.getSession({
          headers: req.headers,
        });

        if (!session) {
          throw new RejectUpload("Unauthorized");
        }

        const extension = file.type.split("/")[1] ?? "png";

        return {
          objectInfo: {
            key: `user-avatars/${session.user.id}/${Date.now()}.${extension}`,
          },
        };
      },
    }),
  },
};

export const { POST } = toRouteHandler(router);
