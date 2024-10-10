import { EyeOff } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export default function PrivateDashboard() {
  return (
    <section className='container my-12 max-w-2xl'>
      <Card className='flex h-48 items-center justify-center'>
        <CardContent className='p-0'>
          <EyeOff className='mr-2 inline h-5 w-5' />
          <span>This profile is private</span>
        </CardContent>
      </Card>
    </section>
  );
}
