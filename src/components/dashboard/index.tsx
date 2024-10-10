'use client';

import type { User } from 'lucia';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import RecentlyPlayedSection from '~/components/dashboard/recently-played';
import TopAlbumsSection from '~/components/dashboard/top-albums';
import TopArtistsSection from '~/components/dashboard/top-artists';
import TopGenresSection from '~/components/dashboard/top-genres';
import TopTracksSection from '~/components/dashboard/top-tracks';
import { useState } from 'react';
import type { UserSettings } from '~/server/db/schema';
import { ChevronDown } from 'lucide-react';
import { capitalizeWords } from '~/lib/utils';

interface Props {
  user: User;
  settings: UserSettings | undefined;
}

export default function Dashboard({ user, settings }: Props) {
  const [selectedSection, setSelectedSection] = useState('tracks');

  const renderSection = () => {
    switch (selectedSection) {
      case 'tracks':
        return <TopTracksSection user={user} settings={settings} />;
      case 'artists':
        return <TopArtistsSection user={user} settings={settings} />;
      case 'genres':
        return <TopGenresSection user={user} settings={settings} />;
      case 'albums':
        return <TopAlbumsSection user={user} settings={settings} />;
      case 'recentlyPlayed':
        return <RecentlyPlayedSection user={user} settings={settings} />;
      default:
        return <TopTracksSection user={user} settings={settings} />;
    }
  };

  return (
    <div className='container mx-auto mt-8 max-w-2xl'>
      <div className='mt-8'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className='flex items-center'>
              <span className='text-xl font-semibold'>
                {capitalizeWords(selectedSection)}
              </span>
              <ChevronDown className='ml-2 inline h-4 w-4' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start'>
            <DropdownMenuCheckboxItem
              checked={selectedSection === 'tracks'}
              onCheckedChange={() => setSelectedSection('tracks')}
            >
              Tracks
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedSection === 'artists'}
              onCheckedChange={() => setSelectedSection('artists')}
            >
              Artists
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedSection === 'genres'}
              onCheckedChange={() => setSelectedSection('genres')}
            >
              Genres
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedSection === 'albums'}
              onCheckedChange={() => setSelectedSection('albums')}
            >
              Albums
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedSection === 'recentlyPlayed'}
              onCheckedChange={() => setSelectedSection('recentlyPlayed')}
            >
              Recently Played
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {renderSection()}
    </div>
  );
}
