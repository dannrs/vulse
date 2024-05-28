'use client';

import { Button } from '../ui/button';
import { MdGridOff, MdGridOn } from 'react-icons/md';
import { useRef, useState } from 'react';
import { cn, getSectionDescription } from '~/lib/utils';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, EyeOff, Share } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import type { User } from 'lucia';
import { api } from '~/trpc/react';
import { useSession } from '../session-provider';
import type { Period } from '~/types';
import type { UserSettings } from '~/server/db/schema';

interface Props {
  user: User;
  settings: UserSettings | undefined;
  period: Period;
}

export default function TopAlbumsSection({ user, settings, period }: Props) {
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
  const { data, isLoading } = api.spotify.getTopAlbums.useQuery(
    {
      id: user.id,
      period,
    },
    { enabled: settings?.topAlbums !== false }
  );

  const topAlbumsDescription = getSectionDescription({
    period,
    session,
    user,
    section: 'top albums',
  });

  return (
    <section className='container flex max-w-66 flex-col'>
      <div className='flex items-center justify-between pb-4'>
        <div className='w-[85%]'>
          <h1 className='font-heading text-xl font-semibold'>Top albums</h1>
          <p className='max-w-[30ch] truncate text-sm text-foreground/80 sm:max-w-[80%] lg:max-w-[95%]'>
            {topAlbumsDescription}
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
      {isLoading ? (
        <div className='flex gap-4 overflow-x-hidden'>
          {Array.from(new Array(10)).map((_, index: number) => (
            <div key={index} className='flex flex-col'>
              <Skeleton className='h-32 w-32' />
              <div className='space-y-2'>
                <Skeleton className='mb-1 mt-2 h-5 w-32' />
                <Skeleton className='h-5 w-32' />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {!settings?.topAlbums && !session ? (
            <div className='my-4 flex items-center justify-center'>
              <div className='flex flex-col items-center gap-2'>
                <EyeOff className='h-4 w-4' />
                <div className='text-sm'>
                  {user.name} doesn&apos;t share this
                </div>
              </div>
            </div>
          ) : (
            <div
              ref={scrollContainerRef}
              className={cn(
                'gap-4 overflow-x-hidden',
                isGrid
                  ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7'
                  : 'flex'
              )}
            >
              {data?.map(({ albumName, details }, index) => (
                <li key={index} className='flex flex-col'>
                  <div className='relative h-32 w-32'>
                    <Image
                      src={details.imageUrl ?? ''}
                      alt={albumName}
                      fill
                      sizes='128px'
                      className='object-cover'
                    />
                  </div>
                  <div className='pt-2'>
                    <p className='line-clamp-2 font-semibold'>
                      {index + 1}. {albumName}
                    </p>
                    <p className='line-clamp-1 text-sm text-foreground/80'>
                      {details.artist}
                    </p>
                  </div>
                </li>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
