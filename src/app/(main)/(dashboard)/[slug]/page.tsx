import { notFound } from 'next/navigation';
import TopTracks from '~/components/dashboard/top-tracks';
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

  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.slug, slug),
  });

  console.log('user:', user);

  if (!user) notFound();
  
  return <TopTracks />;
}
