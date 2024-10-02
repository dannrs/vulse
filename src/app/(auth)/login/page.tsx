import { redirect } from 'next/navigation';
import { validateRequest } from '~/lib/auth/validate-request';
import { Login } from './login';

export default async function LoginPage() {
  const { user } = await validateRequest();

  if (user) redirect(`/${user.slug}`);

  return <Login />;
}
