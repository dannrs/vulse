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
import { ChevronDown, ChevronUp, EyeOff } from 'lucide-react';
import Link from 'next/link';

interface Props {
  user: User;
  settings: UserSettings | undefined;
}

export default function RecentlyPlayedSection({ user, settings }: Props) {
  const [showAll, setShowAll] = useState(false);

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
    <section>
      <div className='flex items-center justify-between'>
        <div className='w-[85%]'>
          <h1 className='sr-only'>Recent streams</h1>
          <p className='text-sm text-foreground/80'>
            {session ? 'Your' : `${user.name}'s`} recently played tracks
          </p>
        </div>
      </div>
      {isLoading ? (
        <>
          {Array.from(new Array(10)).map((_, index: number) => (
            <div key={index} className='my-4 flex flex-col'>
              <Skeleton className='h-16' />
            </div>
          ))}
        </>
      ) : (
        <>
          {!settings?.recentlyPlayed && !session ? (
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
                  <div className='my-4 flex rounded-md border transition-transform duration-200 ease-in-out hover:scale-105'>
                    <Image
                      src={track.albumImageUrl ?? ''}
                      alt={track.title}
                      width={64}
                      height={64}
                      className='aspect-square rounded-s-md object-cover'
                    />
                    <div className='flex flex-grow items-center justify-between px-4'>
                      <div className='mr-4 min-w-0 flex-grow'>
                        <p className='line-clamp-1 font-semibold'>
                          {track.title}
                        </p>
                        <p className='line-clamp-1 text-sm text-foreground/80'>
                          {track.artist}
                        </p>
                      </div>
                      <p className='flex-shrink-0 whitespace-nowrap text-sm text-foreground/80'>
                        {formatDateDifference(track.playedAt)}
                      </p>
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
