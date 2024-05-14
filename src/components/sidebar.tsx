'use client';

import { LockKeyhole, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '~/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/settings/profile', icon: UserRound, label: 'Profile' },
    { href: '/settings/privacy', icon: LockKeyhole, label: 'Privacy' },
    // Add more links here as needed
  ];

  return (
    <div className='sticky top-24 pt-2'>
      {links.map(({ href, icon: Icon, label }) => (
        <Link href={href} key={href}>
          <div
            className={cn(
              pathname === href ? 'bg-accent' : '',
              'flex items-center rounded-md p-2 hover:bg-accent'
            )}
          >
            <Icon className='mr-2 h-4 w-4' />
            {label}
          </div>
        </Link>
      ))}
    </div>
  );
}
