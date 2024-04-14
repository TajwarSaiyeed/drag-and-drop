import {createUploadthing, type FileRouter} from "uploadthing/next";
import {UploadThingError} from "uploadthing/server";
import {useAuth} from "@clerk/nextjs";

const f = createUploadthing();
export const ourFileRouter = {
    attachment: f(["pdf", "image/gif", "image/tiff", "image/tiff", "image/jpeg", "image/png", "image/bmp", "image/webp"])
        .middleware(() => {
            const {userId} = useAuth();
            if (!userId) throw new UploadThingError("You must be logged in to upload files");
            return {userId}
        })
        .onUploadComplete(() => {
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;