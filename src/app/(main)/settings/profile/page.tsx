import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import SettingsForm from '~/components/settings-form';
import DeleteAccount from '~/components/settings/delete-account';
import { PrivacySettingsForm } from '~/components/settings/privacy-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { validateRequest } from '~/lib/auth/validate-request';
import { Paths } from '~/lib/constants';

export const metadata: Metadata = {
  title: 'Profile Settings',
};

export default async function SettingsPage() {
  const { user } = await validateRequest();
  if (!user) redirect(Paths.Login);

  return (
    <Tabs defaultValue='profile' className='container mx-auto mt-8 max-w-2xl'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='profile'>Profile</TabsTrigger>
        <TabsTrigger value='privacy'>Privacy</TabsTrigger>
      </TabsList>
      <TabsContent value='profile' className='my-4'>
        <SettingsForm />
        <DeleteAccount />
      </TabsContent>
      <TabsContent value='privacy'>
        <PrivacySettingsForm />
      </TabsContent>
    </Tabs>
  );
}
