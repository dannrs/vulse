'use client'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { api } from '~/trpc/react';
import { Skeleton } from './ui/skeleton';
import Link from 'next/link';
import { LogOut, Settings, UserRound } from 'lucide-react';
import { logout } from '~/lib/auth/actions';
import { Button } from './ui/button';

export default function UserButton() {
  const { data: profile, isLoading } = api.user.getUserById.useQuery();
  const { data: profilePicture } = api.user.getProfilePicture.useQuery();
  if (isLoading) return <Skeleton className='h-8 w-8 rounded-full' />;
  if (!profile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className='h-8 w-8'>
          <AvatarImage src={profilePicture?.url ?? ''} />
          <AvatarFallback>{profile.name?.substring(0, 1)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[350px] space-y-1'>
        <div className='flex items-center gap-2 px-6 py-4'>
          <Avatar className='h-11 w-11'>
            <AvatarImage src={profilePicture?.url ?? ''} />
            <AvatarFallback>{profile.name?.substring(0, 1)}</AvatarFallback>
          </Avatar>
          <div className='w-[350px] truncate'>
            <p className='ml-2'>{profile.name}</p>
            {/* <p className='text-foreground/70'>{user.email}</p> */}
            <p className='ml-2 truncate text-[0.85rem] text-foreground/70'>
              {profile.email}
            </p>
          </div>
        </div>
        <Link href={`/${profile.slug}`}>
          <DropdownMenuItem className='flex items-center gap-2 px-6 py-2.5'>
            <UserRound className='mr-2 h-4 w-4 text-foreground/70' />
            My page
          </DropdownMenuItem>
        </Link>
        <Link href='/settings'>
          <DropdownMenuItem className='flex items-center gap-2 px-6 py-2.5'>
            <Settings className='mr-2 h-4 w-4 text-foreground/70' />
            Settings
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
          <DropdownMenuItem className='px-5'>
        <form action={logout}>
          <Button className='flex items-center gap-2 font-normal' size='xs' variant='ghost' type='submit'>
            <LogOut className='mr-2 h-3.5 w-3.5 text-foreground/70' />
            Sign out
          </Button>
        </form>
</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
