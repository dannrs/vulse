'use client';

import type { User } from 'lucia';
import Image from 'next/image';
import { Skeleton } from '~/components/ui/skeleton';
import { api } from '~/trpc/react';
import SpotifyCard from '../spotify-card';

interface Props {
  user: User;
}

const ProfileSection = ({ user }: Props) => {
  const { data: profile, isLoading } = api.spotify.getProfile.useQuery({
    id: user.id,
  });
  const { data: profilePicture } = api.spotify.getProfilePicture.useQuery({
    id: user.id,
  });
  const { data: currentlyPlaying } = api.spotify.getCurrentlyPlaying.useQuery({
    id: user.id,
  });
  const { data: recentlyPlayed } = api.spotify.getRecentlyPlayed.useQuery(
    {
      id: user.id,
      limit: 1,
    },
    { refetchInterval: 60000 }
  );

  return (
    <>
      {isLoading ? (
        <section className='flex flex-col items-center justify-center gap-4'>
          <Skeleton className='aspect-square h-[100px] w-[100px] rounded-full' />
          <div className='flex h-[85%] w-full flex-col items-center justify-center'>
            <Skeleton className='mb-4 h-5 w-32' />
            <Skeleton className='h-4 w-40' />
            <Skeleton className='my-8 h-12 w-48 rounded-md' />
          </div>
        </section>
      ) : (
        <section>
          <div className='flex flex-col items-center justify-center gap-4'>
            {profilePicture?.url ? (
              <Image
                src={profilePicture.url ?? ''}
                alt='Profile Image'
                width={100}
                height={100}
                className='aspect-square rounded-full'
              />
            ) : (
              <div className='flex h-[100px] w-[100px] items-center justify-center rounded-full bg-accent '>
                <span className='text-7xl'>
                  {profile?.name?.substring(0, 1)}
                </span>
              </div>
            )}
            <div className='flex w-full flex-col items-center justify-center'>
              <div className='text-lg font-semibold'>
                {profile?.name ? `@${profile.name}` : '@user'}
              </div>
              <div className='line-clamp-3 text-foreground/80'>
                {profile?.description}
              </div>
              {currentlyPlaying?.isPlaying ? (
                <SpotifyCard data={currentlyPlaying} />
              ) : (
                recentlyPlayed?.[0] && (
                  <SpotifyCard data={recentlyPlayed?.[0]} />
                )
              )}
            </div>
          </div>
          {/* <div className='flex justify-between'>
            <Button size='sm' variant='link' className='w-[150px]' asChild>
              <Link href='/settings'>Edit profile</Link>
            </Button>
          </div> */}
        </section>
      )}
    </>
  );
};

export default ProfileSection;
