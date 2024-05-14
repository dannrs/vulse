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
        <CardDescription className='bg-accent p-3 rounded-md'>
        If you were redirected from the login page, then you are not registered. Please register first and wait for the confirmation email. <Link href='https://developer.spotify.com/documentation/web-api/concepts/quota-modes' target='_blank' className='font-semibold hover:underline hover:underline-offset-4'><span>Learn more</span><ExternalLink className='inline ml-1 mb-[0.15rem] h-3.5 w-3.5' /></Link>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegistrationForm />
      </CardContent>
    </Card>
  );
}
