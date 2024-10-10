'use client';

import { capitalizeWords } from '~/lib/utils';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardDropdown({ slug }: { slug: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const section = pathname.split('/').pop() ?? 'tracks';

  const updateSection = (newSection: string) => {
    router.push(`/${slug}/${newSection}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='flex items-center'>
          <span className='text-xl font-semibold'>
            {capitalizeWords(section)}
          </span>
          <ChevronDown className='ml-2 inline h-4 w-4' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuCheckboxItem
          checked={section === 'tracks'}
          onCheckedChange={() => updateSection('tracks')}
        >
          Top Tracks
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={section === 'artists'}
          onCheckedChange={() => updateSection('artists')}
        >
          Top Artists
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={section === 'genres'}
          onCheckedChange={() => updateSection('genres')}
        >
          Top Genres
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={section === 'albums'}
          onCheckedChange={() => updateSection('albums')}
        >
          Top Albums
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={section === 'recents'}
          onCheckedChange={() => updateSection('recents')}
        >
          Recently Played
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
