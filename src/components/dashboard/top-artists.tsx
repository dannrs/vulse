'use client';

import { useState } from 'react';
import { Button } from '../ui/button';
import { formatNumber } from '~/lib/utils';
import Image from 'next/image';
import { ChevronDown, ChevronUp, EyeOff } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import type { User } from 'lucia';
import { useSession } from '../session-provider';
import { api } from '~/trpc/react';
import { Period } from '~/types';
import type { UserSettings } from '~/server/db/schema';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface Props {
  user: User;
  settings: UserSettings | undefined;
}

export default function TopArtistsSection({ user, settings }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [period, setPeriod] = useState<Period>(Period.SHORT_TERM);

  const { session } = useSession();
  const { data, isLoading } = api.spotify.getTopArtists.useQuery(
    {
      id: user.id,
      period,
    },
    { enabled: settings?.topArtists !== false }
  );

  const periodDescription =
    period === Period.LONG_TERM
      ? '1 year'
      : `${period === Period.SHORT_TERM ? '4 weeks' : '6 months'}`;
  const userDescription = session ? 'Your' : `${user.name}'s`;

  const visibleData = showAll ? data : data?.slice(0, 10);

  return (
    <section>
      <div className='flex items-center justify-between'>
        <div className='w-[85%]'>
          <h1 className='sr-only'>Top Artists</h1>
          <div className='flex items-center gap-1 text-sm text-foreground/80'>
            <span>{userDescription} top artists from the past</span>
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
          {!settings?.topArtists && !session ? (
            <div className='my-12 flex flex-col items-center gap-2'>
              <EyeOff className='h-4 w-4' />
              <div className='text-sm'>{user.name} doesn&apos;t share this</div>
            </div>
          ) : (
            <div className='relative mx-auto'>
              {visibleData?.map((artist) => (
                <Link
                  key={artist.id}
                  href={artist.url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <div className='my-4 flex rounded-md border transition-transform duration-200 ease-in-out hover:scale-105'>
                    <Image
                      src={artist.imageUrl ?? ''}
                      alt={artist.name}
                      width={64}
                      height={64}
                      className='aspect-square rounded-s-md object-cover'
                    />
                    <div className='flex flex-grow items-center justify-between px-4'>
                      <div className='min-w-0 flex-grow'>
                        <p className='line-clamp-1 font-semibold'>
                          {artist.name}
                        </p>
                        <p className='line-clamp-1 text-sm text-foreground/80'>
                          {formatNumber(artist.followers ?? 0)} followers
                        </p>
                      </div>
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
            </div>
          )}
        </>
      )}
    </section>
  );
}
