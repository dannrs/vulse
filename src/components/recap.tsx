'use client';

import { toJpeg } from 'html-to-image';
import { useEffect, useRef, useState } from 'react';
import { api } from '~/trpc/react';
import { useSession } from './session-provider';
import { Paths } from '~/lib/constants';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { formatGenre } from '~/lib/utils';
import { Zap } from 'lucide-react';

export default function Recap() {
  const { user } = useSession();

  if (!user) redirect(Paths.Login);

  const { data: topArtists } = api.spotify.getTopArtists.useQuery({
    id: user.id,
    period: 'short_term',
  });

  const { data: topTracks } = api.spotify.getTopTracks.useQuery({
    id: user.id,
    period: 'short_term',
  });

  const { data: topGenres } = api.spotify.getTopGenres.useQuery({
    id: user.id,
    period: 'short_term',
  });
  const [topGenre, setTopGenre] = useState<string | null>(null);

  useEffect(() => {
    if (topGenres) {
      const sortedGenres = Object.entries(topGenres).sort(
        (a, b) => b[1] - a[1]
      );
      setTopGenre(sortedGenres[0]?.[0] ?? '');
    }
  }, [topGenres]);

  const { data: topAlbums } = api.spotify.getTopAlbums.useQuery({
    id: user.id,
    period: 'short_term',
  });

  const date = new Date();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const year = date.toLocaleString('en-US', { year: 'numeric' });

  const componentRef = useRef(null);

  const handleDownloadImage = async () => {
    if (componentRef.current) {
      const dataUrl = await toJpeg(componentRef.current, {
        width: 1080,
        height: 1920,
        style: {
          transform: 'scale(4)',
          transformOrigin: 'top left',
          width: '270px',
          height: '480px',
        },
      });
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${user.name}-recap-${month}-${year}`;
      link.click();
    }
  };

  return (
    <div className='flex flex-col items-center justify-center gap-2 p-4'>
      <div
        ref={componentRef}
        className='flex h-[480px] w-[270px] flex-col justify-between bg-[#33005E]'
      >
        <div>
          {/* <h1 className='text-xl font-bold'>May 2024 Recap</h1> */}
          <div className='relative mx-auto my-10 h-[144px] w-[144px]'>
            <Image
              src={topArtists?.[0]?.imageUrl ?? ''}
              alt={topArtists?.[0]?.name ?? ''}
              fill
              sizes='144px'
              className='object-cover'
            />
          </div>
          <div className='flex flex-col items-center justify-center'>
            <div className='grid grid-cols-2 gap-4 px-4'>
              <div className='flex flex-col gap-0.5 '>
                <h2 className='text-xs font-medium'>Top Artists</h2>
                {topArtists?.slice(0, 5).map((artist, index) => (
                  <div key={index}>
                    <p className='max-w-[14ch] truncate text-xs font-semibold'>
                      {index + 1}&nbsp;&nbsp;{artist.name}
                    </p>
                  </div>
                ))}
              </div>
              <div className='flex flex-col gap-0.5 '>
                <h2 className='text-xs font-medium'>Top Tracks</h2>
                {topTracks?.slice(0, 5).map((track, index) => (
                  <div key={index} className=''>
                    <p className='max-w-[14ch] truncate text-xs font-semibold'>
                      {index + 1}&nbsp;&nbsp;{track.title}
                    </p>
                  </div>
                ))}
              </div>
              <div className='flex flex-col flex-wrap'>
                <h2 className='text-[0.8rem] font-medium'>Top Album</h2>
                <p className='line-clamp-2 font-semibold'>
                  {topAlbums?.[0]?.albumName}
                </p>
              </div>
              <div className='flex flex-col'>
                <h2 className='text-[0.8rem] font-medium'>Top Genre</h2>
                <p className='line-clamp-2 font-semibold'>
                  {formatGenre(topGenre ?? '')}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className='flex justify-between p-4 text-[0.8rem]'>
            <Zap className='inline h-5 w-5' />
            <span className='text-xs font-semibold'>
              vulse.vercel.app/recap
            </span>
          </div>
        </div>
      </div>
      <button
        onClick={handleDownloadImage}
        className='mt-4 rounded bg-blue-500 px-4 py-2 text-white'
      >
        Download
      </button>
    </div>
  );
}
