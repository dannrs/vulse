import { notFound } from 'next/navigation';
import Dashboard from '~/components/dashboard';
import PrivateDashboard from '~/components/dashboard/private-dashboard';
import { validateRequest } from '~/lib/auth/validate-request';
import { db } from '~/server/db';

interface UserPageProps {
  params: {
    slug: string;
  };
}

export const generateStaticParams = async (): Promise<
  UserPageProps['params'][]
> => {
  const users = await db.query.users.findMany();

  return users.map((user) => ({ slug: user.slug ?? '' }));
};

export default async function UserPage({ params }: UserPageProps) {
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

  return <Dashboard user={user} settings={userPrivacySettings} />;
}
