import * as z from 'zod';

export const profileSettingsSchema = z.object({
  displayName: z.string().min(1).max(12),
  description: z.string().max(120).optional(),
  slug: z.string().min(2).max(30),
});

export const registrationSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
});

export const privacySettingsSchema = z.object({
  publicProfile: z.boolean(),
  topGenres: z.boolean(),
  topTracks: z.boolean(),
  topArtists: z.boolean(),
  topAlbums: z.boolean(),
  recentlyPlayed: z.boolean(),
});
