import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { validateRequest } from '~/lib/auth/validate-request';
import { Login } from './login';

export const metadata: Metadata = {
  title: 'Login',
};

export default async function LoginPage() {
  const { user } = await validateRequest();

  if (user) redirect(`/${user.slug}`);

  return <Login />;
}
