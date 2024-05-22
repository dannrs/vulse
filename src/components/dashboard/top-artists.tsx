'use client';

import { useRef, useState } from 'react';
import { Button } from '../ui/button';
import { MdGridOff, MdGridOn } from 'react-icons/md';
import { cn, getSectionDescription } from '~/lib/utils';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, EyeOff, Share } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import type { User } from 'lucia';
import { useSession } from '../session-provider';
import { api } from '~/trpc/react';
import type { Period } from '~/types';
import type { UserSettings } from '~/server/db/schema';

interface Props {
  user: User;
  settings: UserSettings | undefined;
  period: Period;
}

export default function TopArtistsSection({ user, settings, period }: Props) {
  const [isGrid, setIsGrid] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleLayout = () => {
    setIsGrid(!isGrid);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const { session } = useSession();
  const { data, isLoading } = api.spotify.getTopArtists.useQuery(
    {
      id: user.id,
      period,
    },
    { enabled: settings?.topArtists !== false }
  );

  const topArtistsDescription = getSectionDescription({
    period,
    session,
    user,
    section: 'top artists',
  });

  return (
    <section className='container flex max-w-66 flex-col'>
      <div className='flex items-center justify-between pb-4'>
        <div className='w-[85%]'>
          <h1 className='font-heading text-xl font-semibold'>Top Artists</h1>
          <p className='max-w-[30ch] truncate text-sm text-foreground/80 sm:max-w-[80%] lg:max-w-[95%]'>
            {topArtistsDescription}
          </p>
        </div>
        <div className='flex w-[15%] justify-end space-x-1'>
          <Button onClick={toggleLayout} variant='outline' size='xs'>
            {isGrid ? (
              <MdGridOff className='h-4 w-4' aria-label='Enable grid layout' />
            ) : (
              <MdGridOn className='h-4 w-4' aria-label='Disable grid layout' />
            )}
          </Button>
          <Button
            disabled={isGrid}
            onClick={scrollLeft}
            variant='outline'
            size='xs'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            disabled={isGrid}
            onClick={scrollRight}
            variant='outline'
            size='xs'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button variant='outline' size='xs'>
            <Share className='h-4 w-4' />
          </Button>
        </div>
      </div>
      <div
        ref={scrollContainerRef}
        className={cn(
          'gap-4 overflow-x-hidden',
          isGrid
            ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'
            : 'flex'
        )}
      >
        {isLoading ? (
          <>
            {Array.from(new Array(10)).map((_, index: number) => (
              <div key={index} className='flex flex-col'>
                <Skeleton className='h-32 w-32 rounded-full' />
                <Skeleton className='mt-2 h-5 w-32' />
              </div>
            ))}
          </>
        ) : (
          <>
            {!settings?.topArtists && !session ? (
              <div className='mx-auto my-4'>
                <div className='flex flex-col items-center gap-2'>
                  <EyeOff className='h-4 w-4' />
                  <div className='text-sm'>
                    {user.name} doesn&apos;t share this
                  </div>
                </div>
              </div>
            ) : (
              <>
                {data?.map((artist, index) => (
                  <div key={artist.id} className='flex flex-col'>
                    <div className='relative h-32 w-32'>
                      <Image
                        src={artist.imageUrl ?? ''}
                        alt={artist.name}
                        fill
                        sizes='128px'
                        className='rounded-full object-cover'
                      />
                    </div>
                    <div className='pt-2'>
                      <p className='text-center font-semibold'>
                        {index + 1}. {artist.name}
                      </p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
