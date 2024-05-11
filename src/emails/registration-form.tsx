'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import type * as z from 'zod';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { registrationSchema } from '~/lib/validations';

export function RegistrationForm() {
  const form = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      name: '',
      email: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof registrationSchema>) {
    try {
      await fetch('/api/email', {
        method: 'POST',
        body: JSON.stringify({
          name: values.name,
          email: values.email,
        }),
      });
      form.reset();
      toast.success('Thank you for registering. We will reach you soon!');
    } catch (error) {
      toast.error('Something went wrong. Please try again!');
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-4'
      >
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder='John Doe' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='johndoe@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          disabled={
            form.formState.isSubmitting ||
            !form.formState.isValid ||
            !form.formState.isDirty
          }
        >
          {form.formState.isSubmitting ? (
            <>
              <LoaderCircle className='mr-2 h-4 w-4 animate-spin' />
              Submitting...
            </>
          ) : (
            'Submit'
          )}
        </Button>
        <Button variant='outline' className='w-full' asChild>
          <Link href='/'>Cancel</Link>
        </Button>
      </form>
    </Form>
  );
}
