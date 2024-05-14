'use client';

import type { User } from 'lucia';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import ProfileSection from '~/components/dashboard/profile';
import RecentlyPlayedSection from '~/components/dashboard/recently-played';
import TopAlbumsSection from '~/components/dashboard/top-albums';
import TopArtistsSection from '~/components/dashboard/top-artists';
import TopGenresSection from '~/components/dashboard/top-genres';
import TopTracksSection from '~/components/dashboard/top-tracks';
import { useState } from 'react';
import { Period } from '~/types';

interface Props {
  user: User;
}

export default function Dashboard({ user }: Props) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>(
    Period.SHORT_TERM
  );

  const handlePeriodChange = (selectedValue: Period) => {
    setSelectedPeriod(selectedValue);
  };

  console.log('selectedPeriod:', selectedPeriod);

  return (
    <div className='space-y-12'>
        <ProfileSection user={user} />
      <div className='container max-w-66 mx-auto flex justify-end'>
        <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select a period' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={Period.SHORT_TERM}>4 weeks</SelectItem>
            <SelectItem value={Period.MEDIUM_TERM}>6 month</SelectItem>
            <SelectItem value={Period.LONG_TERM}>Lifetime</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <TopTracksSection user={user} period={selectedPeriod} />
      <TopArtistsSection user={user} period={selectedPeriod} />
      <RecentlyPlayedSection user={user} />
      <TopGenresSection user={user} period={selectedPeriod} />
      <TopAlbumsSection user={user} period={selectedPeriod} />
    </div>
  );
}
