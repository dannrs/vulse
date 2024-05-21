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
  console.log('slug:', slug);

  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.slug, slug),
  });

  console.log('user dari user page:', user);

  if (!user) notFound();

  const userPrivacySettings = await db.query.userPrivacySettings.findFirst({
    where: (table, { eq }) => eq(table.userId, user.id),
  });

  console.log('user privacy dari user page:', userPrivacySettings);

  const isOwner = session?.userId === user.id;

  return (
    <>
      {userPrivacySettings?.publicProfile && isOwner ? (
        <Dashboard user={user} />
      ) : (
        <PrivateDashboard />
      )}
    </>
  );
}
