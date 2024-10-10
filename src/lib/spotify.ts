import { SpotifyApi, type AccessToken } from '@spotify/web-api-ts-sdk';
import { db } from '~/server/db';
import { spotify } from './auth';
import { oauthAccount } from '~/server/db/schema';
import { eq } from 'drizzle-orm';
import { env } from '~/env';
import type { TRPCContext } from '~/server/api/trpc';
import { TRPCError } from '@trpc/server';

export async function getSpotifyApi(userId: string) {
  const client_id = env.SPOTIFY_CLIENT_ID;

  // Retrieve tokens from the database
  const tokens = await db.query.oauthAccount.findFirst({
    where: (table, { eq }) => eq(table.userId, userId),
  });
  console.log('access token:', tokens?.accessToken);
  console.log('access token expiredat:', tokens?.expiresAt?.toLocaleString());

  const isTokenExpired =
    tokens?.expiresAt && tokens.expiresAt < new Date(Date.now());
  console.log(isTokenExpired);
  if (isTokenExpired) {
    // Use the refresh token to obtain a new access token
    const refreshedTokens = await spotify.refreshAccessToken(
      tokens.refreshToken ?? ''
    );
    console.log('refreshed token:', refreshedTokens.accessToken);
    console.log(
      'refreshed token expiredat:',
      refreshedTokens.accessTokenExpiresAt.toLocaleString()
    );

    // Update the database with the new tokens
    await db
      .update(oauthAccount)
      .set({
        accessToken: refreshedTokens.accessToken,
        expiresAt: refreshedTokens.accessTokenExpiresAt,
      })
      .where(eq(oauthAccount.userId, userId));

    // Create AccessToken object with new token
    const accessToken: AccessToken = {
      access_token: refreshedTokens.accessToken,
      expires_in: 3600, // assuming new token also expires in 1 hour
      token_type: 'Bearer',
      refresh_token: refreshedTokens.refreshToken,
    };

    // Return Spotify API object with the new access token
    return SpotifyApi.withAccessToken(client_id, accessToken);
  } else {
    // Return Spotify API object with the existing access token
    const accessToken: AccessToken = {
      access_token: tokens?.accessToken ?? '',
      expires_in: 3600,
      token_type: 'Bearer',
      refresh_token: tokens?.refreshToken ?? '',
    };

    return SpotifyApi.withAccessToken(client_id, accessToken);
  }
}

// Check if the user profile is private
export async function getPrivateSpotifyUser(ctx: TRPCContext, userId: string) {
  const userSettings = await db.query.userPrivacySettings.findFirst({
    where: (table, { eq }) => eq(table.userId, userId),
  });

  if (!userSettings) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
  }

  if (userSettings.publicProfile === false && (!ctx.session || !ctx.user)) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'This profile is private',
    });
  }
  return userSettings;
}
