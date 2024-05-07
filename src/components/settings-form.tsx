'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Dot } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type * as z from 'zod';
import { useUploadThing } from '~/lib/uploadthing';
import { settingsSchema } from '~/lib/validations';
import { api } from '~/trpc/react';
import { Button } from './ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';

export default function SettingsForm() {
  const utils = api.useUtils();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing('imageUploader', {
    onUploadBegin: () => {
      toast.loading('Uploading...', { id: 'uploading' });
    },
    onClientUploadComplete: () => {
      toast.dismiss('uploading');
      utils.user.getProfilePicture
        .invalidate()
        .then(() => {
          toast.success('Photo profile changed!');
        })
        .catch(() => {
          toast.error('Something went wrong. Please try again.');
        });
    },
    onUploadError: () => {
      toast.error('Something went wrong. Please try again.');
    },
  });

  const { data: user, isLoading: isLoadingUser } =
    api.user.getUserById.useQuery();
  const { data: profilePicture } = api.user.getProfilePicture.useQuery();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: '',
      description: '',
      slug: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (!isLoadingUser && user) {
      form.reset({
        displayName: user.name ?? '',
        description: user.description ?? '',
        slug: user.slug ?? '',
      });
    }
  }, [isLoadingUser, user, form]);

  const { data: isSlugAvailable, isLoading: isCheckingSlug } =
    api.user.checkSlugAvailability.useQuery({
      slug: form.watch('slug'),
    });

  console.log(isSlugAvailable, isCheckingSlug);

  const { mutate: updateUser } = api.user.updateUserById.useMutation({
    onSuccess: () => {
      utils.user.getUserById
        .invalidate()
        .then(() => {
          toast.success('Profile updated');
        })
        .catch(() => {
          toast.error('Something went wrong. Please try again!');
        });
    },
    onError: () => {
      toast.error('Something went wrong. Please try again!');
    },
  });

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    updateUser(values);
  };

  const onImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const acceptedFiles = Array.from(event.target.files ?? []);

    console.log(acceptedFiles);
    if (acceptedFiles.length > 0) {
      startUpload(acceptedFiles).catch((error) => {
        console.error('Upload failed:', error);
        toast.error('Upload failed. Please try again.');
      });
    }
  };

  return (
    <section className='flex flex-col items-center'>
      <div className='w-full max-w-5xl'>
        {isLoadingUser ? (
          <div>
            <Skeleton className='mx-auto my-4 h-[150px] w-[150px] rounded-full' />
            <div className='mt-12'>
              {Array.from(new Array(3)).map((_, index: number) => (
                <div key={index}>
                  <Skeleton className='mb-2 h-5 w-20' />
                  <Skeleton className='mb-5 h-10 w-full' />
                </div>
              ))}
            </div>
            <Skeleton className='h-10 w-16' />
          </div>
        ) : (
          <>
            {profilePicture?.url ? (
              <div className='group relative mx-auto my-4 h-[150px] w-[150px] cursor-pointer'>
                <Image
                  src={profilePicture.url}
                  alt='Profile picture'
                  width={150}
                  height={150}
                  className='aspect-square rounded-full transition-opacity duration-200 group-hover:opacity-60'
                  onClick={onImageClick}
                />
                <p className='absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-[0.8rem] leading-4 font-medium'>
                  Change profile picture
                </p>
                <Input
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={onFileChange}
                  ref={fileInputRef}
                />
              </div>
            ) : (
              <></>
            )}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='mt-6 space-y-3'
              >
                <FormField
                  control={form.control}
                  name='displayName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={12} />
                      </FormControl>
                      <div className='relative flex items-center'>
                        <FormMessage />
                        <p className='absolute right-0 pt-2 text-xs text-foreground/70'>
                          {field.value.length}/12
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='slug'
                  render={({ field, fieldState: { error } }) => (
                    <FormItem>
                      <div className='flex items-center'>
                        <FormLabel>Custom URL</FormLabel>
                        <div>
                          {!error && (
                            <div className='flex items-center'>
                              <Dot className='inline' />
                              {isCheckingSlug ? (
                                <p className='text-sm font-medium'>
                                  Checking...
                                </p>
                              ) : isSlugAvailable ? (
                                <p className='text-sm font-medium text-primary'>
                                  Available!
                                </p>
                              ) : (
                                <p className='text-sm font-medium text-destructive'>
                                  Unavailable!
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <FormControl>
                        <Input {...field} maxLength={30} />
                      </FormControl>
                      <div className='relative flex items-center'>
                        <FormMessage />
                        <p className='absolute right-0 pt-2 text-xs text-foreground/70'>
                          {field.value.length}/30
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={120} />
                      </FormControl>
                      <div className='relative flex items-center'>
                        <FormMessage />
                        <p className='absolute right-0 pt-2 text-xs text-foreground/70'>
                          {field.value?.length}/120
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  disabled={
                    !isSlugAvailable ||
                    !form.formState.isValid ||
                    form.formState.isSubmitting ||
                    !form.formState.isDirty
                  }
                  type='submit'
                >
                  Save
                </Button>
              </form>
            </Form>
          </>
        )}
      </div>
    </section>
  );
}
