import { notFound } from 'next/navigation';
import ProfileSection from '~/components/dashboard/profile';
import { db } from '~/server/db';

interface Props {
  children: React.ReactNode;
  params: {
    slug: string;
  };
}

export const generateStaticParams = async (): Promise<Props['params'][]> => {
  const users = await db.query.users.findMany();

  return users.map((user) => ({ slug: user.slug ?? '' }));
};

export default async function DashboardPageLayout({ children, params }: Props) {
  const { slug } = params;

  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.slug, slug),
  });

  if (!user) notFound();

  return (
    <>
      <ProfileSection user={user} />
      {children}
    </>
  );
}
