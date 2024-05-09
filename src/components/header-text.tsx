'use client';

import { TypeAnimation } from 'react-type-animation';

export default function HeaderText() {
  return (
    <div className='text-[2rem] leading-8 font-bold sm:text-4xl md:text-5xl lg:text-6xl'>
      <h1>Quickly share your favorite</h1>
      <TypeAnimation
        sequence={[
          'tracks', // Types 'One'
          2000, // Waits 1s
          'artists', // Deletes 'One' and types 'Two'
          2000, // Waits 2s
          'genres',
          2000, // Types 'Three' without deleting 'Two'
          'albums',
          2000, // Types 'Three' without deleting 'Two'
        ]}
        wrapper='span'
        cursor={true}
        repeat={Infinity}
        className='inline-block text-[#CD44D0]'
      />
    </div>
  );
}
