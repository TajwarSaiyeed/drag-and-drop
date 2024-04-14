import { createUploadthing, type FileRouter, UTFiles } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { handleAuth } from "@/lib/utils";

const f = createUploadthing();

export const ourFileRouter = {
  attachment: f([
    "pdf",
    "image/gif",
    "image/tiff",
    "image/tiff",
    "image/jpeg",
    "image/png",
    "image/bmp",
    "image/webp",
  ])
    .middleware(async ({ req, files }) => {
      const { userId } = handleAuth();
      if (!userId)
        throw new UploadThingError("You must be logged in to upload files");
      const identifier = {
        customId: userId,
        ...files[0],
        name: files[0].name,
      };
      return {
        userId,
        [UTFiles]: [identifier],
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      metadata;
      file.customId;
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
