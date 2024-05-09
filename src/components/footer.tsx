import Link from 'next/link';
import { RiGithubFill, RiTwitterFill, RiDiscordFill } from 'react-icons/ri';
import ModeToggle from './mode-toggle';

export default function Footer() {
  return (
    <footer className='max-w-68 container flex flex-col items-center'>
      <div className='grid h-52 w-full grid-cols-4 py-8'>
        <div className='flex flex-col gap-4 text-3xl font-bold'>
          <div>Vulse</div>
          <div className='flex gap-2 sm:gap-4 text-xl'>
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
      <div className='max-w-68 flex  h-24 w-full items-center justify-between'>
        <p className='text-sm text-foreground/80'>
          © 2024 Vulse. All rights reserved.
        </p>
        <ModeToggle />
      </div>
    </footer>
  );
}
