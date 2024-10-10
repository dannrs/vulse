import { Disc3 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '~/lib/utils';
import type { RecentlyPlayedTrack, CurrentlyPlayingTrack } from '~/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface Props {
  data: RecentlyPlayedTrack | CurrentlyPlayingTrack;
}

export default function SpotifyCard({ data }: Props) {
  const isPlaying = 'isPlaying' in data;
  return (
    <Link href={data.songUrl} target='_blank' rel='noopener noreferrer'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className='my-8 flex cursor-pointer rounded-md border transition-transform duration-200 ease-in-out hover:scale-105'>
              <Image
                src={data?.albumImageUrl ?? ''}
                alt={data?.album ?? ''}
                width={48}
                height={48}
                className='aspect-square rounded-s-md object-cover'
              />
              <div className='flex flex-grow items-center justify-between px-4'>
                <div className='flex min-w-48 flex-grow items-center justify-between gap-4'>
                  <div>
                    <p className='line-clamp-1 text-sm font-semibold'>
                      {data?.title}
                    </p>
                    <p className='line-clamp-1 text-xs text-foreground/80'>
                      {data?.artist}
                    </p>
                  </div>
                  <Disc3
                    className={cn(
                      isPlaying ? 'animate-spin-slow' : '',
                      'inline size-5'
                    )}
                  />
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side='bottom'>
            {isPlaying ? <p>Currently playing</p> : <p>Recently played</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Link>
  );
}
