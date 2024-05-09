import { Menu } from 'lucide-react';
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu';
import { validateRequest } from '~/lib/auth/validate-request';
import UserButton from './user-button';

export default async function Navbar() {
  const { user } = await validateRequest();

  return (
    <div className='sticky inset-x-0 top-0 z-40 flex h-16 justify-center backdrop-blur-lg transition-all container max-w-68'>
      <nav className='flex w-full items-center justify-between p-0 sm:py-3'>
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

        <div className='flex items-center space-x-4'>
          {user ? (
            <UserButton />
          ) : (
            <>
              <div className='hidden sm:flex gap-4'>
                <Button size='xs' variant='link' asChild>
                  <Link href='/auth/login'>Sign in</Link>
                </Button>
                <Button size='sm' asChild>
                  <Link href='/auth/signup'>Get started</Link>
                </Button>
              </div>
              <div className='sm:hidden'>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Menu className='h-6 w-6' />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    className='w-[350px] space-y-1'
                  >
                    <Link href='/auth/login'>
                      <DropdownMenuItem className='flex items-center gap-2 px-6 py-2.5'>
                        Sign in
                      </DropdownMenuItem>
                    </Link>
                    <Link href='/auth/signup'>
                      <DropdownMenuItem className='flex items-center gap-2 px-6 py-2.5'>
                        Get started
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
