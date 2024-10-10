export enum Period {
  SHORT_TERM = 'short_term',
  MEDIUM_TERM = 'medium_term',
  LONG_TERM = 'long_term',
}

export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string | undefined;
  songUrl: string;
};

export interface TopTrack extends Track {
  previewUrl: string | null;
}

export interface RecentlyPlayedTrack extends Track {
  playedAt: string;
}

export interface CurrentlyPlayingTrack extends Track {
  isPlaying: boolean;
}
