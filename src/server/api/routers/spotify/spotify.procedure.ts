import * as z from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { getSpotifyApi } from '~/lib/spotify';
import { TRPCError } from '@trpc/server';
import { db } from '~/server/db';
import type { MaxInt } from '@spotify/web-api-ts-sdk';

export const spotifyRouter = createTRPCRouter({
  getProfile: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, input.id),
      });
    }),
  getProfilePicture: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return await db.query.profilePicture.findFirst({
        where: (table, { eq }) => eq(table.userId, input.id),
      });
    }),
  getTopTracks: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const spotify = await getSpotifyApi(input.id);

      if (!spotify) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const data = await spotify.currentUser.topItems(
        'tracks',
        'short_term',
        50
      );
      const { items } = data;

      const tracks = items.map((track) => {
        return {
          id: track.id,
          title: track.name,
          artist: track.artists.map((artist) => artist.name).join(', '),
          albumImageUrl: track.album.images[0]?.url,
          songUrl: track.external_urls.spotify,
        };
      });

      return tracks;
    }),
  getTopArtists: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const spotify = await getSpotifyApi(input.id);

      if (!spotify) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const data = await spotify.currentUser.topItems(
        'artists',
        'short_term',
        50
      );
      const { items } = data;

      const artists = items.map((artist) => {
        return {
          id: artist.id,
          name: artist.name,
          imageUrl: artist.images[0]?.url,
          url: artist.external_urls.spotify,
        };
      });

      return artists;
    }),
  getRecentlyPlayed: publicProcedure
    .input(z.object({ id: z.string(), limit: z.number() }))
    .query(async ({ input }) => {
      const spotify = await getSpotifyApi(input.id);
      console.log(input.id);

      if (!spotify) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const limit = Math.max(0, Math.min(input.limit, 50)) as MaxInt<50>;
      const data = await spotify.player.getRecentlyPlayedTracks(limit);
      const { items } = data;

      const tracks = items.map(({ track, played_at }) => {
        return {
          id: track.id,
          title: track.name,
          artist: track.artists.map((artist) => artist.name).join(', '),
          album: track.album.name,
          albumImageUrl: track.album.images[0]?.url,
          songUrl: track.external_urls.spotify,
          playedAt: played_at,
        };
      });

      return tracks;
    }),
  getTopAlbums: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const spotify = await getSpotifyApi(input.id);

      if (!spotify) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const data = await spotify.currentUser.topItems(
        'tracks',
        'short_term',
        50
      );
      const { items } = data;

      const albums = items.reduce(
        (acc, track) => {
          const albumName = track.album.name;
          const albumImage = track.album.images[0]?.url ?? '';
          const artistName = track.artists.map((artist) => artist.name).join(', ');

          if (acc[albumName]) {
            (acc[albumName] as { count: number }).count++;
          } else {
            acc[albumName] = {
              count: 1,
              imageUrl: albumImage,
              artist: artistName,
            };
          }
          return acc;
        },
        {} as Record<string, { count: number; imageUrl: string, artist: string }>
      );

      return albums;
    }),
  getTopGenres: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const spotify = await getSpotifyApi(input.id);

      if (!spotify) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const data = await spotify.currentUser.topItems(
        'artists',
        'short_term',
        50
      );
      const { items } = data;

      const genres = items
        .map((artist) => artist.genres)
        .flat()
        .reduce(
          (acc, curr) => {
            if (acc[curr]) {
              acc[curr]++;
            } else {
              acc[curr] = 1;
            }
            return acc;
          },
          {} as Record<string, number>
        );

      return genres;
    }),
});
