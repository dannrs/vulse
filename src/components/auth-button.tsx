'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

export default function AuthButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  return (
    <>
      <div className='hidden gap-4 sm:flex'>
        <Button size='xs' variant='link' asChild>
          <Link href='/auth/login'>Sign in</Link>
        </Button>
        <Button size='sm' asChild>
          <Link href='/auth/signup'>Get started</Link>
        </Button>
      </div>
      <div className='sm:hidden'>
        <DropdownMenu onOpenChange={toggleDropdown}>
          <DropdownMenuTrigger>
            {isOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='mt-4 w-screen space-y-1 rounded-none border-none p-3 sm:hidden'
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
  );
}
