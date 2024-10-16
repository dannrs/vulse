import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import DashboardDropdown from '~/components/dashboard/dashboard-dropdown';
import PrivateDashboard from '~/components/dashboard/private-dashboard';
import TopTracksSection from '~/components/dashboard/top-tracks';
import { validateRequest } from '~/lib/auth/validate-request';
import { db } from '~/server/db';

interface Props {
  params: {
    slug: string;
  };
}

export const metadata: Metadata = {
  title: 'Top Tracks',
};

export const generateStaticParams = async (): Promise<Props['params'][]> => {
  const users = await db.query.users.findMany();

  return users.map((user) => ({ slug: user.slug ?? '' }));
};

export default async function TracksPage({ params }: Props) {
  const { slug } = params;
  const { session } = await validateRequest();

  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.slug, slug),
  });

  if (!user) notFound();

  const userPrivacySettings = await db.query.userPrivacySettings.findFirst({
    where: (table, { eq }) => eq(table.userId, user.id),
  });

  if (!session && !userPrivacySettings?.publicProfile) {
    return <PrivateDashboard />;
  }

  return (
    <div className='container mx-auto mt-8 max-w-2xl'>
      {/* <h1 className='text-xl font-semibold'>Top Tracks</h1> */}
      <DashboardDropdown slug={slug} />
      <TopTracksSection user={user} settings={userPrivacySettings} />
    </div>
  );
}