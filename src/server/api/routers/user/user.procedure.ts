import { db } from '~/server/db';
import { createTRPCRouter, protectedProcedure } from '../../trpc';

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => ctx.user),
  getProfilePicture: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    return await db.query.profilePicture.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    });
  }),
});
