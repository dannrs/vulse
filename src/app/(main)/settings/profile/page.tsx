import { redirect } from 'next/navigation';
import SettingsForm from '~/components/settings-form';
import DeleteAccount from '~/components/settings/delete-account';
import { validateRequest } from '~/lib/auth/validate-request';
import { Paths } from '~/lib/constants';

export default async function SettingsPage() {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);

  return (
    <div className='mb-20 mt-8 pl-12'>
      <SettingsForm />
      <DeleteAccount />
    </div>
  );
}
