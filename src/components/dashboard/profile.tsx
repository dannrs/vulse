'use client';

import type { User } from 'lucia';
import Image from 'next/image';
import Link from 'next/link';
import { SiSpotify } from 'react-icons/si';
import { Skeleton } from '~/components/ui/skeleton';
import { api } from '~/trpc/react';

interface Props {
  user: User;
}

const ProfileSection = ({ user }: Props) => {
  const { data, isLoading } = api.spotify.getProfile.useQuery({ id: user.id });
  const { data: profilePicture } = api.spotify.getProfilePicture.useQuery({
    id: user.id,
  });
  // const isLoading = false

  return (
    <>
      {isLoading ? (
        <section className='container flex max-w-4xl flex-col justify-center gap-2'>
          <div className='flex h-full w-full items-center gap-8'>
            <Skeleton className='aspect-square h-[150px] w-[150px] rounded-full' />
            <div className='flex h-[85%] w-full flex-col justify-center gap-4'>
              <Skeleton className='h-5 w-32' />
              <Skeleton className='h-4 w-3/5' />
              <Skeleton className='h-4 w-4 rounded-full' />
            </div>
          </div>
        </section>
      ) : (
        <section>
          <div className='container flex max-w-4xl flex-col justify-center gap-2'>
            <div className='flex h-full items-center gap-8'>
              {profilePicture?.url ? (
                <Image
                  src={profilePicture.url ?? ''}
                  alt='Profile Image'
                  width={150}
                  height={150}
                  className='aspect-square rounded-full'
                />
              ) : (
                <div className='flex h-[150px] w-[150px] items-center justify-center rounded-full bg-accent '>
                  <span className='text-8xl'>
                    {data?.name?.substring(0, 1)}
                  </span>
                </div>
              )}
              <div className='flex h-[85%] flex-col justify-center gap-1'>
                <div className='text-lg font-semibold md:text-[1.35rem]'>
                  {data?.name}
                </div>
                <div className='text-foreground/80'>{data?.description}</div>
                {/* <div className='line-clamp-3 mt-1 mb-2'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam vel provident totam rerum debitis dolor! Molestias, ut nobis reiciendis nemo ea enim, nostrum consequatur sequi, error quo eos doloribus minus! Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem id eveniet fugit architecto eligendi, ad nesciunt harum iure doloribus tempore optio totam repellat perspiciatis inventore, ipsa, officiis recusandae quis aliquam.</div> */}

                <div className='flex gap-2'>
                  <Link href={data?.spotifyUrl ?? ''}>
                    <SiSpotify className='h-4 w-4 text-foreground hover:text-primary' />
                  </Link>
                </div>
              </div>
            </div>
            {/* <div className='flex justify-between'>
            <Button size='sm' variant='link' className='w-[150px]' asChild>
              <Link href='/settings'>Edit profile</Link>
            </Button>
          </div> */}
          </div>
        </section>
      )}
    </>
  );
};

export default ProfileSection;
