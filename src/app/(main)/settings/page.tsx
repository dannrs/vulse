import { redirect } from 'next/navigation';
import SettingsForm from '~/components/settings-form';
import { validateRequest } from '~/lib/auth/validate-request';
import { Paths } from '~/lib/constants';

export default async function SettingsPage() {
    const {user} = await validateRequest();
    if (!user) redirect(Paths.Login);

  return (
    <div className='mt-12 mb-20'>
      <SettingsForm />
    </div>
  );
}
