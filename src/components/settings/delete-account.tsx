'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '~/trpc/react';
import { Button } from '../ui/button';
import { useSession } from '../session-provider';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';

export default function DeleteAccount() {
  const router = useRouter();
  const { session } = useSession();

  const { mutate: deleteUser } = api.user.deleteUser.useMutation({
    onSuccess: () => {
      toast.success('Account deleted successfully');
      router.push('/goodbye');
    },
    onError: () => {
      toast.error('Failed to delete account. Please try again.');
    },
  });

  const handleDeleteAccount = () => {
    if (session?.userId) {
      deleteUser();
    } else {
      toast.error('User ID not found. Please try again');
    }
  };

  return (
    <Card className='my-8 w-full border-destructive'>
      <CardHeader>
        <CardTitle>Danger Zone</CardTitle>
        <CardDescription>Delete your account permanently</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat
            cumque commodi asperiores ducimus reprehenderit eos nostrum, enim
            voluptates facilis dignissimos recusandae repellat qui dicta quo
            nisi aut quibusdam ab culpa.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='destructive'>Delete</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type='submit' onClick={handleDeleteAccount}>
                  Yes
                </Button>
                <DialogClose asChild>
                  <Button type='button' variant='secondary'>
                    Cancel
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
