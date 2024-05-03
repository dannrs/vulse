import Link from 'next/link';
import { Button } from '~/components/ui/button';

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
          <Button variant='link' size='xs'>
            Sign in
          </Button>
          <Button size='sm'>
            Get started
          </Button>
        </div>
      </nav>
    </div>
  );
}
