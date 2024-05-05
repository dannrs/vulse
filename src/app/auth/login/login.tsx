'use client';

import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { SiSpotify } from 'react-icons/si';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { APP_TITLE } from '~/lib/constants';

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='text-center'>
        <CardTitle>{APP_TITLE} Log In</CardTitle>
        <CardDescription>
          Log in with your Spotify account to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <Button
          className='w-full'
          asChild
          onClick={() => setIsLoading(true)}
          disabled={isLoading}
        >
          <Link href='/auth/login/spotify'>
            {isLoading ? (
              <>
                <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
                Logging in...
              </>
            ) : (
              <>
                <SiSpotify className='mr-2 h-4 w-4' />
                Log in with Spotify
              </>
            )}
          </Link>
        </Button>
        <Button variant='outline' className='w-full' asChild>
          <Link href='/'>Cancel</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
