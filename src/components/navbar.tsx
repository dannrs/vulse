import Link from 'next/link';
import { validateRequest } from '~/lib/auth/validate-request';
import UserButton from './user-button';
import AuthButton from './auth-button';

export default async function Navbar() {
  const { user } = await validateRequest();

  return (
    <div className='container sticky inset-x-0 top-0 z-40 flex h-16 max-w-68 justify-center backdrop-blur-lg transition-all'>
      <nav className='flex w-full items-center justify-between p-0 sm:py-3'>
        <Link href='/' className='z-50 flex text-2xl font-bold'>
          Vulse
        </Link>
        {/* <div className='flex items-center gap-5 bg-red-500'>
          <Link href='/'>Link1</Link>
          <Link href='/'>Link2</Link>
          <Link href='/'>Link3</Link>
          <Link href='/'>Link4</Link>
          <Link href='/'>Link5</Link>
        </div> */}
        <div className='flex items-center space-x-4'>
          {user ? <UserButton /> : <AuthButton />}
        </div>
      </nav>
    </div>
  );
}
