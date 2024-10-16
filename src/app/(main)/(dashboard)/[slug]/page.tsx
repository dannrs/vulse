import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Dashboard from '~/components/dashboard';
import { db } from '~/server/db';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;

  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.slug, slug),
  });

  if (!user) {
    return {
      title: 'User Not Found',
    };
  }

  return {
    title: `@${user.name}`,
  };
}

export const generateStaticParams = async (): Promise<Props['params'][]> => {
  const users = await db.query.users.findMany();

  return users.map((user) => ({ slug: user.slug ?? '' }));
};

export default async function UserPage({ params }: Props) {
  const { slug } = params;

  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.slug, slug),
  });

  if (!user) notFound();

  const userPrivacySettings = await db.query.userPrivacySettings.findFirst({
    where: (table, { eq }) => eq(table.userId, user.id),
  });

  return <Dashboard user={user} settings={userPrivacySettings} />;
}
