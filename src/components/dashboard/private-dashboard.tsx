import { EyeOff } from 'lucide-react';

export default function PrivateDashboard() {
  return (
    <section className='my-20 flex items-center justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <EyeOff className='h-5 w-5' />
        <div>This profile is private</div>
      </div>
    </section>
  );
}
