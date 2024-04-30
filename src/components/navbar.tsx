import Link from 'next/link';
import ModeToggle from '~/components/mode-toggle';
import { Button } from '~/components/ui/button';
import { ChevronRight } from 'lucide-react';

export default function Navbar() {
  return (
    <div className='flex justify-center'>
      <nav className='sticky inset-x-0 top-0 z-40 flex min-h-16 w-full max-w-5xl items-center justify-between p-3 backdrop-blur-lg transition-all'>
        <Link href='/' className='z-50 flex text-2xl font-bold'>
          Vulse
        </Link>
        {/* <div className='flex items-center gap-5 bg-red-500'>
          <Link href='/'>Link1</Link>
          <Link href='/'>Link2</Link>
          <Link href='/'>Link3</Link>
          <Link href='/'>Link4</Link>
          <Link href='/'>Link5</Link>
        </div> */}
        <div className='hidden items-center space-x-4 sm:flex'>
          <ModeToggle />
          <Button size='xs'>
            <span className='ml-1'>Sign in</span>
            <ChevronRight className='ml-1 mt-0.5 h-4 w-4' />
          </Button>
        </div>
      </nav>
    </div>
  );
}
