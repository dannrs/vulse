'use client';

import { api } from '~/trpc/react';
import { useSession } from '../session-provider';
import { Skeleton } from '../ui/skeleton';
import type { User } from 'lucia';
import { Period } from '~/types';

interface Props {
  user: User;
  period: Period;
}

export default function TopGenresSection({ user, period }: Props) {
  const { session } = useSession();
  const { data, isLoading } = api.spotify.getTopGenres.useQuery({
    id: user.id,
    period,
  });

  return (
    <section className='container flex max-w-66 flex-col'>
      <div className='flex flex-col pb-4'>
        <h1 className='font-heading text-xl font-semibold'>Top genres</h1>
        <p className='text-sm text-foreground/80'>
          {period === Period.LONG_TERM
            ? session
              ? 'Your'
              : `${user.name}'s lifetime top genres`
            : session
              ? 'Your'
              : `${user.name}'s top genres from the past ${period === Period.SHORT_TERM ? '4 weeks' : '6 months'}`}
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
    </section>
  );
}
