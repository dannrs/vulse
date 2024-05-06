import { eq } from 'drizzle-orm';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { validateRequest } from '~/lib/auth/validate-request';
import { db } from '~/server/db';
import { profilePicture } from '~/server/db/schema';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '1MB' } })
    .middleware(async () => {
      const { user } = await validateRequest();

      if (!user) throw new UploadThingError('Unauthorized');

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      await db
        .update(profilePicture)
        .set({
          id: file.key,
          url: file.url,
        })
        .where(eq(profilePicture.userId, metadata.userId));
      return { id: file.key, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
