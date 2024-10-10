'use client';

import { api } from '~/trpc/react';
import { useSession } from '../session-provider';
import { Skeleton } from '../ui/skeleton';
import type { User } from 'lucia';
import { Period } from '~/types';
import type { UserSettings } from '~/server/db/schema';
import { EyeOff } from 'lucide-react';
import { useState } from 'react';
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

export default function TopGenresSection({ user, settings }: Props) {
  const [period, setPeriod] = useState<Period>(Period.SHORT_TERM);
  const { session } = useSession();
  const { data, isLoading } = api.spotify.getTopGenres.useQuery(
    {
      id: user.id,
      period,
    },
    { enabled: settings?.topGenres !== false }
  );

  const periodDescription =
    period === Period.LONG_TERM
      ? '1 year'
      : `${period === Period.SHORT_TERM ? '4 weeks' : '6 months'}`;
  const userDescription = session ? 'Your' : `${user.name}'s`;

  return (
    <section>
      <div className='flex flex-col'>
        <h1 className='sr-only'>Top genres</h1>
        <div className='flex items-center gap-1 text-sm text-foreground/80'>
          <span>{userDescription} top genres from the past</span>
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
        <ul className='flex w-full flex-wrap justify-between gap-2'>
          {Array.from(new Array(20)).map((_, index: number) => (
            <div key={index}>
              <Skeleton className='h-9 w-32' />
            </div>
          ))}
        </ul>
      ) : (
        <>
          {!settings?.topGenres && !session ? (
            <div className='my-12 flex flex-col items-center gap-2'>
              <EyeOff className='h-4 w-4' />
              <div className='text-sm'>{user.name} doesn&apos;t share this</div>
            </div>
          ) : (
            <ul className='my-4 flex flex-wrap gap-2'>
              {data &&
                Object.keys(data).map((genre, index) => (
                  <li
                    key={index}
                    className='whitespace-nowrap rounded-3xl bg-muted px-4 py-2 text-sm'
                  >
                    {genre}
                  </li>
                ))}
            </ul>
          )}
        </>
      )}
    </section>
  );
}
