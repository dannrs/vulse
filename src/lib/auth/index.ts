import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia } from 'lucia';
import { Spotify } from 'arctic';
import { env } from '~/env';
import { db } from '~/server/db';
import {
  sessions,
  users,
  type User as DatabaseUserAttributes,
} from '~/server/db/schema';
import { absoluteUrl } from '../utils';

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => attributes,
  sessionCookie: {
    name: 'session',
    expires: false,
    attributes: {
      secure: env.NODE_ENV === 'production',
    },
  },
});

export const spotify = new Spotify(
  env.SPOTIFY_CLIENT_ID,
  env.SPOTIFY_CLIENT_SECRET,
  absoluteUrl('/login/spotify/callback')
);

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
