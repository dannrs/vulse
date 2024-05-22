'use client';

import { api } from '~/trpc/react';
import { useSession } from '../session-provider';
import { Skeleton } from '../ui/skeleton';
import type { User } from 'lucia';
import type { Period } from '~/types';
import { getSectionDescription } from '~/lib/utils';
import type { UserSettings } from '~/server/db/schema';
import { EyeOff } from 'lucide-react';

interface Props {
  user: User;
  settings: UserSettings | undefined;
  period: Period;
}

export default function TopGenresSection({ user, settings, period }: Props) {
  const { session } = useSession();
  const { data, isLoading } = api.spotify.getTopGenres.useQuery(
    {
      id: user.id,
      period,
    },
    { enabled: settings?.topGenres !== false }
  );

  const topGenresDescription = getSectionDescription({
    period,
    session,
    user,
    section: 'top genres',
  });

  return (
    <section className='container flex max-w-66 flex-col'>
      <div className='flex flex-col pb-4'>
        <h1 className='font-heading text-xl font-semibold'>Top genres</h1>
        <p className='max-w-full truncate text-sm text-foreground/80'>
          {topGenresDescription}
        </p>
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
            <div className='my-4 flex items-center justify-center'>
              <div className='flex flex-col items-center gap-2'>
                <EyeOff className='h-4 w-4' />
                <div className='text-sm'>
                  {user.name} doesn&apos;t share this
                </div>
              </div>
            </div>
          ) : (
            <ul className='flex flex-wrap gap-2'>
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
