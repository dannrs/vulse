import Footer from '~/components/footer';
import Navbar from '~/components/navbar';

export default function LandingPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <div className='border-t'>
        <Footer />
      </div>
    </>
  );
}
