import { SpotifyApi, type AccessToken } from '@spotify/web-api-ts-sdk';
import { db } from '~/server/db';
import { spotify } from './auth';
import { oauthAccount } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

const client_id = process.env.SPOTIFY_CLIENT_ID!;

export async function getSpotifyApi(userId: string) {
  // Retrieve tokens from the database
  const tokens = await db.query.oauthAccount.findFirst({
    where: (table, { eq }) => eq(table.userId, userId),
  });
  console.log('access token:', tokens?.accessToken);
  console.log('access token expiredat:', tokens?.expiresAt?.toLocaleString());

  const isTokenExpired = tokens?.expiresAt && tokens.expiresAt < new Date()
  console.log(isTokenExpired)
  if (isTokenExpired) {
    // Use the refresh token to obtain a new access token
    const refreshedTokens = await spotify.refreshAccessToken(
      tokens?.refreshToken ?? ''
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
    //   await db.Vupdate({
    //     where: { userId: userId },
    //     data: {

    //       accessToken: refreshedTokens.accessToken,
    //       refreshToken: refreshedTokens.refreshToken, // Update refresh token if it has changed
    //     },
    //   });

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
