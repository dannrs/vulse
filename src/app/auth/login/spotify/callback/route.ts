import { type UserProfile as SpotifyUser } from '@spotify/web-api-ts-sdk';
import { OAuth2RequestError } from 'arctic';
import { generateId } from 'lucia';
import { cookies } from 'next/headers';
import { NextResponse, type NextRequest } from 'next/server';
import { lucia, spotify } from '~/lib/auth';
import { Paths } from '~/lib/constants';
import { db } from '~/server/db';
import { oauthAccount, profilePicture, userPrivacySettings, users } from '~/server/db/schema';

export async function GET(req: NextRequest): Promise<Response> {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies().get('spotify_oauth_state')?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
      headers: { Location: Paths.Login },
    });
  }

  try {
    const tokens = await spotify.validateAuthorizationCode(code);

    const spotifyUserRes = await fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const spotifyUser = (await spotifyUserRes.json()) as SpotifyUser;
    console.log(spotifyUser);

    const existingUser = await db.query.users.findFirst({
      where: (table, { eq, or }) =>
        or(
          eq(table.spotifyId, spotifyUser.id),
          eq(table.email, spotifyUser.email)
        ),
    });

    const betaUser = await db.query.betaUsers.findFirst({
      where: (table, { eq }) => eq(table.email, spotifyUser.email),
    })

    const profilePictureUrl =
      spotifyUser.images.find((image) => image.width === 300)?.url ??
      spotifyUser.images[0]?.url;

      if (!betaUser) {
      return new NextResponse(null, {
        status: 302,
        headers: { Location: Paths.Registration},
      });
      }

    if (!existingUser) {
      const userId = generateId(21);
      await db.insert(users).values({
        id: userId,
        spotifyId: spotifyUser.id,
        spotifyUrl: spotifyUser.external_urls.spotify,
        name: spotifyUser.display_name,
        email: spotifyUser.email,
        slug: spotifyUser.id,
      });

      if (profilePictureUrl) {
        await db.insert(profilePicture).values({
          id: generateId(21),
          url: profilePictureUrl,
          userId,
        });
      }

      await db.insert(userPrivacySettings).values({
        id: generateId(21),
        publicProfile: true,
        userId,
      })

      await db.insert(oauthAccount).values({
        id: generateId(15),
        provider: 'github',
        providerUserId: spotifyUser.id,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt: tokens.accessTokenExpiresAt,
        userId,
      });

      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return new NextResponse(null, {
        status: 302,
        headers: { Location: `/${spotifyUser.id}`},
      });
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return new NextResponse(null, {
      status: 302,
      headers: { Location: `/${existingUser.slug}` },
    });
  } catch (e) {
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return NextResponse.json(
        { message: 'Invalid code' },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      { message: 'internal server error' },
      {
        status: 500,
      }
    );
  }
}
