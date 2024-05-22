'use client';

import type { User } from 'lucia';
import Image from 'next/image';
import { useState } from 'react';
import { formatDateDifference } from '~/lib/utils';
import { api } from '~/trpc/react';
import { useSession } from '../session-provider';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import type { UserSettings } from '~/server/db/schema';
import { EyeOff } from 'lucide-react';

interface Props {
  user: User;
  settings: UserSettings | undefined;
}

export default function RecentlyPlayedSection({ user, settings }: Props) {
  const [showAll, setShowAll] = useState<boolean>(false);

  const { session } = useSession();
  const { data, isLoading } = api.spotify.getRecentlyPlayed.useQuery(
    {
      id: user.id,
      limit: 50,
    },
    { enabled: settings?.recentlyPlayed !== false }
  );
  const visibleData = showAll ? data : data?.slice(0, 10);

  return (
    <section className='container flex max-w-66 flex-col'>
      <div className='flex justify-between pb-2'>
        <div className='w-[85%]'>
          <h1 className='font-heading text-xl font-semibold'>Recent streams</h1>
          <p className='max-w-[30ch] truncate text-sm text-foreground/80 sm:max-w-[80%] lg:max-w-[95%]'>
            {session ? 'Your' : `${user.name}'s`} recently played tracks
          </p>
        </div>
        <div className='flex w-[15%] justify-end'>
          {data && data.length > 10 && (
            <Button
              onClick={() => setShowAll(!showAll)}
              className='my-4'
              size='xs'
              variant='outline'
            >
              {showAll ? 'Show less' : 'Show more'}
            </Button>
          )}
        </div>
      </div>
      <div className='flex flex-col gap-4'>
        {isLoading ? (
          <>
            {Array.from(new Array(10)).map((_, index: number) => (
              <div key={index} className='flex gap-2 pt-4'>
                <Skeleton className='h-12 w-12' />
                <div className='flex w-full items-center justify-between'>
                  <div>
                    <Skeleton className='mb-2 h-5 w-36' />
                    <Skeleton className='h-4 w-24' />
                  </div>
                  <Skeleton className='h-4 w-16' />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {!settings?.recentlyPlayed && !session ? (
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
                {visibleData?.map((track) => (
                  <div key={track.id} className='flex gap-4'>
                    <Image
                      src={track.albumImageUrl ?? ''}
                      alt={track.title}
                      width={64}
                      height={64}
                    />
                    <div className='flex w-full items-center justify-between'>
                      <div className='max-w-[25ch] sm:max-w-[40ch] md:max-w-[100ch]'>
                        <p className='truncate font-semibold'>{track.title}</p>
                        <p className='truncate text-sm text-foreground/80'>
                          {track.album}
                        </p>
                        <p className='truncate text-sm text-foreground/80'>
                          {track.artist}
                        </p>
                      </div>
                      <p className='text-sm text-foreground/80'>
                        {formatDateDifference(track.playedAt)}
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
