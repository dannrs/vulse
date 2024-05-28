import * as z from 'zod';
import { db } from '~/server/db';
import { createTRPCRouter, protectedProcedure } from '../../trpc';
import {
  privacySettingsSchema,
  profileSettingsSchema,
} from '~/lib/validations';
import { TRPCError } from '@trpc/server';
import {
  oauthAccount,
  profilePicture,
  sessions,
  userPrivacySettings,
  users,
} from '~/server/db/schema';
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
    .input(profileSettingsSchema)
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
  deleteUser: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.user.id;

    try {
      await db.delete(oauthAccount).where(eq(oauthAccount.userId, userId));
      await db.delete(profilePicture).where(eq(profilePicture.userId, userId));
      await db.delete(sessions).where(eq(sessions.userId, userId));
      await db
        .delete(userPrivacySettings)
        .where(eq(userPrivacySettings.userId, userId));
      await db.delete(users).where(eq(users.id, userId));

      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete user account',
        cause: error,
      });
    }
  }),
  getUserPrivacySettings: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.user.id;

    return await db.query.userPrivacySettings.findFirst({
      where: (table, { eq }) => eq(table.userId, userId),
    });
  }),
  updateUserPrivacySettings: protectedProcedure
    .input(privacySettingsSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;

      await db
        .update(userPrivacySettings)
        .set({
          publicProfile: input.publicProfile,
          topGenres: input.topGenres,
          topTracks: input.topTracks,
          topArtists: input.topArtists,
          topAlbums: input.topAlbums,
          recentlyPlayed: input.recentlyPlayed,
        })
        .where(eq(userPrivacySettings.userId, userId));
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
