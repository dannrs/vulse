import Link from 'next/link';
import { RiGithubFill, RiTwitterFill, RiDiscordFill } from 'react-icons/ri';
import ModeToggle from './mode-toggle';

export default function Footer() {
  return (
    <footer className='flex flex-col items-center border-t'>
      <div className='grid h-52 w-full max-w-5xl grid-cols-4 py-8'>
        <div className='text-3xl font-bold flex flex-col gap-4'>
          <div>Vulse</div>
          <div className='flex gap-4 text-xl'>
            <Link href='/'>
              <RiGithubFill />
            </Link>
            <Link href='/'>
              <RiTwitterFill />
            </Link>
            <Link href='/'>
              <RiDiscordFill />
            </Link>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <h4 className='font-semibold'>Product</h4>
          <div className='flex flex-col gap-2 text-sm text-foreground/80'>
            <Link href='/'>Product1</Link>
            <Link href='/'>Product2</Link>
            <Link href='/'>Product3</Link>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <h4 className='font-semibold'>Resources</h4>
          <div className='flex flex-col gap-2 text-sm text-foreground/80'>
            <Link href='/'>Product1</Link>
            <Link href='/'>Product2</Link>
            <Link href='/'>Product3</Link>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <h4 className='font-semibold'>Legal</h4>
          <div className='flex flex-col gap-2 text-sm text-foreground/80'>
            <Link href='/'>Product1</Link>
            <Link href='/'>Product2</Link>
            <Link href='/'>Product3</Link>
          </div>
        </div>
      </div>
      <div className='flex h-24  w-full max-w-5xl items-center justify-between'>
          <p className='text-sm text-foreground/80'>
            © 2024 Vulse. All rights reserved.
          </p>
          <ModeToggle />
      </div>
    </footer>
  );
}
