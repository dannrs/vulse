'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '~/components/ui/form';
import { Switch } from '~/components/ui/switch';
import { privacySettingsSchema } from '~/lib/validations';
import { api } from '~/trpc/react';
import { useEffect } from 'react';

export function PrivacySettingsForm() {
  const utils = api.useUtils();
  const { data: userPrivacySettings, isLoading } =
    api.user.getUserPrivacySettings.useQuery();

  const form = useForm<z.infer<typeof privacySettingsSchema>>({
    resolver: zodResolver(privacySettingsSchema),
    defaultValues: {
      publicProfile: undefined,
      topGenres: undefined,
      topTracks: undefined,
      topArtists: undefined,
      topAlbums: undefined,
      recentlyPlayed: undefined,
    },
  });

  useEffect(() => {
    if (!isLoading && userPrivacySettings) {
      form.reset({
        publicProfile: userPrivacySettings.publicProfile,
        topGenres: userPrivacySettings.topGenres,
        topTracks: userPrivacySettings.topTracks,
        topArtists: userPrivacySettings.topArtists,
        topAlbums: userPrivacySettings.topAlbums,
        recentlyPlayed: userPrivacySettings.recentlyPlayed,
      });
    }
  }, [userPrivacySettings, isLoading, form]);

  const { mutate: updatePrivacySettings } =
    api.user.updateUserPrivacySettings.useMutation({
      onSuccess: () => {
        utils.user.getUserPrivacySettings
          .invalidate()
          .then(() => {
            toast.success('Profile updated');
          })
          .catch((e) => {
            console.log(e);
          });
      },
      onError: () => {
        toast.error('Something went wrong. Please try again!');
      },
    });

  function onSubmit(data: z.infer<typeof privacySettingsSchema>) {
    updatePrivacySettings(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-6'>
        <div>
          <div className='space-y-4'>
            <FormField
              control={form.control}
              name='publicProfile'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Public profile</FormLabel>
                    <FormDescription>
                      Whether the profile is accessible by others. Turn off to
                      make this profile private.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='topGenres'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Top Genres</FormLabel>
                    <FormDescription>
                      Hide top genres from your profile
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='topTracks'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Top Tracks</FormLabel>
                    <FormDescription>
                      Hide top tracks from your profile
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='topArtists'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Top Artists</FormLabel>
                    <FormDescription>
                      Hide top artists from your profile
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='topAlbums'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Top Albums</FormLabel>
                    <FormDescription>
                      Hide top albums from your profile
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='recentlyPlayed'
              render={({ field }) => (
                <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                  <div className='space-y-0.5'>
                    <FormLabel className='text-base'>Recently Played</FormLabel>
                    <FormDescription>
                      Hide recently played tracks from your profile
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          disabled={form.formState.isSubmitting || !form.formState.isDirty}
          type='submit'
        >
          Save
        </Button>
      </form>
    </Form>
  );
}
