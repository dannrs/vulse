import * as z from 'zod';
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { getSpotifyApi } from '~/lib/spotify';
import { TRPCError } from '@trpc/server';
import { db } from '~/server/db';
import type { MaxInt, Track } from '@spotify/web-api-ts-sdk';
import { getPrivateSpotifyUser } from '~/lib/spotify';

export const spotifyRouter = createTRPCRouter({
  getProfile: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.id, input.id),
      });

      if (!user) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
      }

      const userPrivacySettings = await db.query.userPrivacySettings.findFirst({
        where: (table, { eq }) => eq(table.userId, input.id),
      });

      if (!userPrivacySettings?.publicProfile && (!ctx.session || !ctx.user)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'This profile is private',
        });
      }
      return user;
    }),
  getProfilePicture: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      await getPrivateSpotifyUser(ctx, input.id);

      return await db.query.profilePicture.findFirst({
        where: (table, { eq }) => eq(table.userId, input.id),
      });
    }),
  getTopTracks: publicProcedure
    .input(
      z.object({
        id: z.string(),
        period: z.enum(['short_term', 'medium_term', 'long_term']),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await getPrivateSpotifyUser(ctx, input.id);

      if (!user?.topTracks && (!ctx.session || !ctx.user))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Top tracks disabled',
        });

      const spotify = await getSpotifyApi(input.id);

      if (!spotify) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const data = await spotify.currentUser.topItems(
        'tracks',
        input.period,
        50
      );
      const { items } = data;

      const tracks = items.map((track) => {
        return {
          id: track.id,
          title: track.name,
          artist: track.artists.map((artist) => artist.name).join(', '),
          album: track.album.name,
          albumImageUrl: track.album.images[0]?.url,
          songUrl: track.external_urls.spotify,
          previewUrl: track.preview_url,
        };
      });

      return tracks;
    }),
  getTopArtists: publicProcedure
    .input(
      z.object({
        id: z.string(),
        period: z.enum(['short_term', 'medium_term', 'long_term']),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await getPrivateSpotifyUser(ctx, input.id);

      if (!user?.topArtists && (!ctx.session || !ctx.user))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Top artists disabled',
        });

      const spotify = await getSpotifyApi(input.id);

      if (!spotify) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const data = await spotify.currentUser.topItems(
        'artists',
        input.period,
        50
      );
      const { items } = data;

      const artistDetails = await Promise.all(
        items.map((artist) => spotify.artists.get(artist.id))
      );

      const artists = items.map((artist, index) => {
        return {
          id: artist.id,
          name: artist.name,
          imageUrl: artist.images[0]?.url,
          url: artist.external_urls.spotify,
          followers: artistDetails[index]?.followers.total,
        };
      });

      return artists;
    }),
  getRecentlyPlayed: publicProcedure
    .input(z.object({ id: z.string(), limit: z.number() }))
    .query(async ({ ctx, input }) => {
      const user = await getPrivateSpotifyUser(ctx, input.id);

      if (!user?.recentlyPlayed && (!ctx.session || !ctx.user))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Recently played tracks disabled',
        });

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
    .input(
      z.object({
        id: z.string(),
        period: z.enum(['short_term', 'medium_term', 'long_term']),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await getPrivateSpotifyUser(ctx, input.id);

      if (!user?.topAlbums && (!ctx.session || !ctx.user))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Top albums disabled',
        });

      const spotify = await getSpotifyApi(input.id);

      if (!spotify) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const data = await spotify.currentUser.topItems(
        'tracks',
        input.period,
        50
      );
      const { items } = data;

      const albums = items.reduce(
        (acc, track) => {
          const albumId = track.album.id;
          const albumName = track.album.name;
          const albumImage = track.album.images[0]?.url ?? '';
          const albumUrl = track.album.external_urls.spotify;
          const artistName = track.artists
            .map((artist) => artist.name)
            .join(', ');

          if (acc[albumName]) {
            (acc[albumName] as { count: number }).count++;
          } else {
            acc[albumName] = {
              id: albumId,
              url: albumUrl,
              imageUrl: albumImage,
              artist: artistName,
              count: 1,
            };
          }
          return acc;
        },
        {} as Record<
          string,
          {
            id: string;
            url: string;
            imageUrl: string;
            artist: string;
            count: number;
          }
        >
      );

      const sortedAlbums = Object.entries(albums)
        .map(([albumName, details]) => ({
          albumName,
          details,
        }))
        .sort((a, b) => b.details.count - a.details.count);

      return sortedAlbums;
    }),
  getCurrentlyPlaying: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await getPrivateSpotifyUser(ctx, input.id);

      if (!user?.currentlyPlaying && (!ctx.session || !ctx.user))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Currently playing disabled',
        });

      const spotify = await getSpotifyApi(input.id);

      if (!spotify) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const data = await spotify.player.getCurrentlyPlayingTrack();

      if (data === null) {
        return {
          id: '',
          title: '',
          artist: '',
          album: '',
          albumImageUrl: '',
          songUrl: '',
          isPlaying: false,
        };
      }

      const item = data.item as Track;

      const track = {
        id: item.id,
        title: item.name,
        artist: item.artists.map((artist) => artist.name).join(', '),
        album: item.album.name,
        albumImageUrl: item.album.images[0]?.url,
        songUrl: item.external_urls.spotify,
        isPlaying: data.is_playing,
      };

      return track;
    }),
  getTopGenres: publicProcedure
    .input(
      z.object({
        id: z.string(),
        period: z.enum(['short_term', 'medium_term', 'long_term']),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await getPrivateSpotifyUser(ctx, input.id);

      if (!user?.topGenres && (!ctx.session || !ctx.user))
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'Top genres disabled',
        });

      const spotify = await getSpotifyApi(input.id);

      if (!spotify) throw new TRPCError({ code: 'UNAUTHORIZED' });

      const data = await spotify.currentUser.topItems(
        'artists',
        input.period,
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
