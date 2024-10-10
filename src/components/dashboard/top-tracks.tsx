'use client';

import { Button } from '../ui/button';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ChevronDown, ChevronUp, EyeOff, Pause, Play } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import type { User } from 'lucia';
import { api } from '~/trpc/react';
import { useSession } from '../session-provider';
import { Period, type TopTrack } from '~/types';
import type { UserSettings } from '~/server/db/schema';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Link from 'next/link';
import { toast } from 'sonner';

interface Props {
  user: User;
  settings: UserSettings | undefined;
}

export default function TopTracksSection({ user, settings }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [period, setPeriod] = useState<Period>(Period.SHORT_TERM);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const [audioTime, setAudioTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { session } = useSession();
  const { data, isLoading } = api.spotify.getTopTracks.useQuery(
    {
      id: user.id,
      period,
    },
    { enabled: settings?.topTracks !== false }
  );

  const visibleData = showAll ? data : data?.slice(0, 10);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };
  }, []);

  const handleAudioEnd = () => {
    setPlayingTrackId(null);
    setAudioTime(0);
  };
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setAudioTime(audioRef.current.currentTime);
    }
  };

  const handlePlayPause = async (track: TopTrack) => {
    if (playingTrackId === track.id) {
      if (audioRef.current) {
        audioRef.current?.pause();
        setAudioTime(audioRef.current.currentTime);
      }
      setPlayingTrackId(null);
    } else {
      if (audioRef.current) {
        audioRef.current?.pause();
        audioRef.current.removeEventListener('ended', handleAudioEnd);
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      }

      audioRef.current = new Audio(track.previewUrl ?? '');
      audioRef.current.addEventListener('ended', handleAudioEnd);
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);

      if (playingTrackId !== track.id) {
        setAudioTime(0);
      }

      audioRef.current.currentTime = audioTime;

      try {
        await audioRef.current.play();
        setPlayingTrackId(track.id);
      } catch (error) {
        console.error(error);
        toast.error('Unable to play the preview. Please try again');
      }
    }
  };

  const periodDescription =
    period === Period.LONG_TERM
      ? '1 year'
      : `${period === Period.SHORT_TERM ? '4 weeks' : '6 months'}`;
  const userDescription = session ? 'Your' : `${user.name}'s`;

  return (
    <section>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-1 text-sm text-foreground/80'>
          <span>{userDescription} top tracks from the past</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='flex items-center rounded-md bg-accent px-1 py-0.5'>
                <span className='text-sm text-foreground/80'>
                  {periodDescription}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='center' size='sm'>
              <DropdownMenuCheckboxItem
                checked={period === Period.SHORT_TERM}
                onCheckedChange={() => setPeriod(Period.SHORT_TERM)}
                size='sm'
              >
                4 weeks
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={period === Period.MEDIUM_TERM}
                onCheckedChange={() => setPeriod(Period.MEDIUM_TERM)}
                size='sm'
              >
                6 months
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={period === Period.LONG_TERM}
                onCheckedChange={() => setPeriod(Period.LONG_TERM)}
                size='sm'
              >
                1 year
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {isLoading ? (
        <>
          {Array.from(new Array(10)).map((_, index: number) => (
            <div key={index} className='my-4 flex flex-col '>
              <Skeleton className='h-16' />
            </div>
          ))}
        </>
      ) : (
        <>
          {!settings?.topTracks && !session ? (
            <div className='my-12 flex flex-col items-center gap-2'>
              <EyeOff className='h-4 w-4' />
              <div className='text-sm'>{user.name} doesn&apos;t share this</div>
            </div>
          ) : (
            <>
              {visibleData?.map((track) => (
                <Link
                  key={track.id}
                  href={track.songUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <div
                    key={track.id}
                    className='my-4 flex w-full rounded-md border transition-transform duration-200 ease-in-out hover:scale-105'
                  >
                    <Image
                      src={track.albumImageUrl ?? ''}
                      alt={track.title}
                      width={64}
                      height={64}
                      className='aspect-square rounded-s-md object-cover'
                    />
                    <div className='flex flex-grow items-center justify-between px-4'>
                      <div className='min-w-0 flex-grow'>
                        <p className='line-clamp-1 font-semibold'>
                          {track.title}
                        </p>
                        <p className='line-clamp-1 text-sm text-foreground/80'>
                          {track.artist}
                        </p>
                      </div>
                      <Button
                        size='circle'
                        className='ml-4 flex-shrink-0'
                        onClick={async (e) => {
                          e.preventDefault();
                          await handlePlayPause(track);
                        }}
                      >
                        {playingTrackId === track.id ? (
                          <Pause className='size-4' fill='#09090b' />
                        ) : (
                          <Play className='size-4' fill='#09090b' />
                        )}
                      </Button>
                    </div>
                  </div>
                </Link>
              ))}
              <div className='w-full text-center'>
                <Button
                  variant='link'
                  size='sm'
                  onClick={() => setShowAll(!showAll)}
                >
                  <span>{showAll ? 'Show less' : 'Show more'}</span>
                  {showAll ? (
                    <ChevronUp className='ml-2 size-4' />
                  ) : (
                    <ChevronDown className='ml-2 size-4' />
                  )}
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </section>
  );
}
