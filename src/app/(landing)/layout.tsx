import Footer from '~/components/footer';
import Navbar from '~/components/navbar';

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-svh flex-col'>
      <Navbar />
      <main className='flex flex-grow items-center justify-center'>
        {children}
      </main>
      <Footer />
    </div>
  );
}
