import Sidebar from '~/components/sidebar';

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='container mx-auto flex max-w-68 items-start justify-between'>
      <div className='w-60 h-screen'>
        <Sidebar />
      </div>
      <main className='flex-grow'>{children}</main>
    </div>
  );
}
