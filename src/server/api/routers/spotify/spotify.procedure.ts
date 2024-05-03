import * as z from 'zod'
import { createTRPCRouter, publicProcedure } from '../../trpc';
import { getSpotifyApi } from '~/lib/spotify';
import { TRPCError } from '@trpc/server';

export const spotifyRouter = createTRPCRouter({
  getTopTracks: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const spotify = await getSpotifyApi(input.id)

      if (!spotify) throw new TRPCError({ code: 'UNAUTHORIZED' })

      const data = await spotify.currentUser.topItems(
        'tracks',
        'short_term',
        20
      )
      const { items } = data

      const tracks = items.map(track => {
        return {
          id: track.id,
          title: track.name,
          artist: track.artists.map(artist => artist.name).join(', '),
          albumImageUrl: track.album.images[0]?.url,
          songUrl: track.external_urls.spotify
        }
      })

      return tracks
    }),
});