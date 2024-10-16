import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { validateRequest } from '~/lib/auth/validate-request';
import { Registration } from './registration';

export const metadata: Metadata = {
  title: 'Registration',
};

export default async function RegistrationPage() {
  const { user } = await validateRequest();

  if (user) redirect(`/${user.slug}`);

  return <Registration />;
}
