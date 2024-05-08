'use client';

import type { User } from 'lucia';
import Image from 'next/image';
import { useState } from 'react';
import { formatDateDifference } from '~/lib/utils';
import { api } from '~/trpc/react';
import { useSession } from '../session-provider';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

interface Props {
  user: User;
}

export default function RecentlyPlayedSection({ user }: Props) {
  const [showAll, setShowAll] = useState<boolean>(false);

  const { session } = useSession();
  const { data, isLoading } = api.spotify.getRecentlyPlayed.useQuery({
    id: user.id,
    limit: 50,
  });
  const visibleData = showAll ? data : data?.slice(0, 10);

  return (
    <section className='container flex max-w-66 flex-col'>
      <div className='flex justify-between pb-2'>
        <div>
          <h1 className='font-heading text-xl font-semibold'>Recent streams</h1>
          <p className='text-sm text-foreground/80'>
            {session ? 'Your' : `${user.name}'s`} recently played tracks
          </p>
        </div>
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
            {visibleData?.map((track) => (
              <div key={track.id} className='flex gap-4'>
                <Image
                  src={track.albumImageUrl ?? ''}
                  alt={track.title}
                  width={64}
                  height={64}
                />
                <div className='flex w-full items-center justify-between'>
                  <div className='max-w-[13rem] sm:max-w-full'>
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
      </div>
    </section>
  );
}
