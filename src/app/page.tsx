import { MoveRight } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

export default function Home() {
  return (
    <div className='my-20 flex items-center justify-center '>
      <div className='flex flex-col items-center justify-center gap-5 text-center'>
        <Badge variant='transparent' className='cursor-pointer' size='lg'>
          Vulse beta registration is now open!
          <MoveRight className='ml-1 mt-0.5 h-4 w-4' />
        </Badge>
        <h1 className='text-4xl font-bold md:text-5xl lg:text-6xl'>
          Quickly share your favorites
        </h1>
        <p className='mt-5 max-w-prose text-foreground/80 sm:text-lg'>
          Get instant access to your personalized Spotify data and share it with
          your friends
        </p>
        <div className='w-1/2 flex gap-4'>
          <Input placeholder='Enter your email address...' />
          <Button type='submit'>
            Join beta
          </Button>
        </div>
        <Image src='/hero.png' width={960} height={720} alt='Hero image' />
      </div>
    </div>
  );
}
