import * as z from 'zod';
import { db } from '~/server/db';
import { createTRPCRouter, protectedProcedure } from '../../trpc';
import { settingsSchema } from '~/lib/validations';
import { TRPCError } from '@trpc/server';
import { users } from '~/server/db/schema';
import { and, eq } from 'drizzle-orm';

export const userRouter = createTRPCRouter({
  getUserById: protectedProcedure.query(({ ctx }) => ctx.user),
  getProfilePicture: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    return await db.query.profilePicture.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    });
  }),
  updateUserById: protectedProcedure
    .input(settingsSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const spotifyId = ctx.user.spotifyId ?? '';

      const slug = await db.query.users.findFirst({
        where: (table, { eq, and, not }) =>
          and(eq(table.slug, input.slug), not(eq(table.id, userId))),
      });

      if (slug)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Custom URL already exists!',
        });

      await db
        .update(users)
        .set({
          name: input.displayName,
          description: input.description,
          slug: input.slug,
        })
        .where(and(eq(users.id, userId), eq(users.spotifyId, spotifyId)));
    }),
  checkSlugAvailability: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      const slug = await db.query.users.findFirst({
        where: (table, { eq, and, not }) =>
          and(eq(table.slug, input.slug), not(eq(table.id, userId))),
      });

      return !slug;
    }),
});
