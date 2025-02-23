import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { stackServerApp } from "@/stack";
import { upload_file } from "@/server/DbActions";
const f = createUploadthing();

const auth = async () => await stackServerApp.getUser()

export const ourFileRouter = {
  imageUploader: f({
    blob: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "1GB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const user = await auth();
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
        const up = await upload_file(file.key, file.ufsUrl, file.name, metadata.userId)
        if(up!=true){
            throw new UploadThingError("Error uploading file")
        }
    
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
