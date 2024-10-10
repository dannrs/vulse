import Link from 'next/link';
import { RiGithubFill } from 'react-icons/ri';

export default function Footer() {
  return (
    <footer className='container mb-8 mt-16 flex max-w-2xl flex-col items-center gap-6 text-center'>
      <div className='flex space-x-4'>
        <Link
          href='https://github.com/dannrs/vulse'
          target='_blank'
          rel='noopener noreferrer'
        >
          <RiGithubFill className='h-6 w-6 text-foreground/80 transition-colors hover:text-foreground' />
        </Link>
      </div>
      <p className='max-w-lg text-sm text-foreground/80'>
        All copyrighted content on Vulse belongs to its respective owners. The
        data is provided by Spotify AB. Vulse is in no way affiliated with
        Spotify AB.
      </p>
      <div className='flex items-center space-x-2'>
        <p className='text-sm text-foreground/80'>
          © 2024 Vulse. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
