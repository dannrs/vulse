import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { Paths } from '~/lib/constants';

export default function Home() {
  return (
    <div className='container mx-auto my-12 max-w-2xl text-center'>
      <div className='flex flex-col items-center justify-center gap-4'>
        <h1 className='text-5xl font-bold'>Quickly share your favorites</h1>
        <p className='mb-2 mt-0 text-foreground/80'>
          Get instant access to your personalized Spotify data and share it with
          your friends
        </p>
        <Button size='sm' asChild>
          <Link href={Paths.Registration}>Get started</Link>
        </Button>
      </div>
    </div>
  );
}
