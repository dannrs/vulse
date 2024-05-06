'use client';

import Image from 'next/image';
import { redirect } from 'next/navigation';
import { useSession } from '~/components/session-provider';
import { Paths } from '~/lib/constants';
import { api } from '~/trpc/react';

export default function TopTracks() {
  const { user } = useSession();
  if (!user) redirect(Paths.Login);
  // const userId = '4lw68z0saod76ctclgla6'
  const { data } = api.spotify.getTopTracks.useQuery({ id: user.id });

  return (
    <section>
      <h1>Top tracks</h1>
      <p>Your top tracks from the past 4 weeks</p>
      <div className='grid grid-cols-5 gap-4'>
        {data?.map((track, index) => (
          <div key={track.id} className='flex flex-col'>
            <div className='relative h-32 w-32'>
              <Image
                src={track.albumImageUrl ?? ''}
                alt={track.title}
                fill
                sizes='128px'
                className='object-cover'
              />
            </div>
            <div className='pt-2'>
              <p className='line-clamp-2 font-semibold'>
                {index + 1}. {track.title}
              </p>
              <p className='line-clamp-1 text-sm'>{track.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}