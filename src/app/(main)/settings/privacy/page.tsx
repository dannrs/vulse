import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { PrivacySettingsForm } from '~/components/settings/privacy-form';
import { validateRequest } from '~/lib/auth/validate-request';
import { Paths } from '~/lib/constants';

export const metadata: Metadata = {
  title: 'Privacy Settings',
};

export default async function PrivacySettingsPage() {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);

  return (
    <div className='mb-20 mt-8 pl-12'>
      <h3>Privacy Settings</h3>
      <PrivacySettingsForm />
    </div>
  );
}
