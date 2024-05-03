import { cookies } from "next/headers";
import { generateState } from "arctic";
import { spotify } from "~/lib/auth";
import { env } from "~/env";
import { NextResponse } from "next/server";

export async function GET(): Promise<Response> {
  const state = generateState();
  const url = await spotify.createAuthorizationURL(state, {
    scopes: ['user-read-email', 'user-read-private', 'user-top-read', 'user-read-playback-state', 'user-read-recently-played', 'user-read-currently-playing'],
  });

  cookies().set("spotify_oauth_state", state, {
    path: "/",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax",
  });

  return NextResponse.redirect(url);
}