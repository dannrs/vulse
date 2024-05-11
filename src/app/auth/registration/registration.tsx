import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { RegistrationForm } from '~/emails/registration-form';
import { APP_TITLE } from '~/lib/constants';

export function Registration() {
  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='text-center space-y-2'>
        <CardTitle>{APP_TITLE} Registration</CardTitle>
        <CardDescription>
        This application is still in development mode. Therefore, in order to use the app, we need to add your name and email to our app&apos;s allowlist. <Link href='https://developer.spotify.com/documentation/web-api/concepts/quota-modes' target='_blank' className='font-semibold hover:underline hover:underline-offset-4'><span>Learn more</span><ExternalLink className='inline ml-1 mb-[0.15rem] h-3.5 w-3.5' /></Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegistrationForm />
      </CardContent>
    </Card>
  );
}
