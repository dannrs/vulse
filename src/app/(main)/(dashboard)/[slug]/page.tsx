import { notFound } from 'next/navigation';
import ProfileSection from '~/components/dashboard/profile';
import RecentlyPlayedSection from '~/components/dashboard/recently-played';
import TopAlbumsSection from '~/components/dashboard/top-albums';
import TopArtistsSection from '~/components/dashboard/top-artists';
import TopGenresSection from '~/components/dashboard/top-genres';
import TopTracksSection from '~/components/dashboard/top-tracks';
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
  console.log('slug:', slug);

  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.slug, slug),
  });

  console.log('user:', user);

  if (!user) notFound();

  return (
    <div className='my-12 space-y-12'>
      <div className='py-8'>
        <ProfileSection user={user} />
      </div>
      <TopTracksSection user={user} />
      <TopArtistsSection user={user} />
      <RecentlyPlayedSection  user={user} />
      <TopGenresSection user={user} />
      <TopAlbumsSection user={user} />
    </div>
  );
}
