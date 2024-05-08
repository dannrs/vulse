import { MoveRight } from 'lucide-react';
import Image from 'next/image';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

export default function Home() {
  return (
    <div className='my-20 flex items-center justify-center '>
      <div className='flex flex-col items-center justify-center gap-5 text-center'>
        <Badge variant='transparent' className='cursor-pointer' size='lg'>
          Vulse beta registration is now open!
          <MoveRight className='ml-1 mt-0.5 h-4 w-4' />
        </Badge>
        <h1 className='md:text-68 text-4xl font-bold lg:text-6xl'>
          Quickly share your favorites
        </h1>
        <p className='mt-5 max-w-prose text-foreground/80 sm:text-lg'>
          Get instant access to your personalized Spotify data and share it with
          your friends
        </p>
        <div className='z-30 flex w-1/2 gap-4'>
          <Input placeholder='Enter your email address...' />
          <Button type='submit'>Join beta</Button>
        </div>
        <div className='flex flex-col items-center'>
          <Image
            src='/hero-gradient.png'
            width={980}
            height={473}
            alt='Hero gradient'
            className='mt-[-5rem]'
          />
          <Image
            src='/hero.png'
            width={960}
            height={720}
            alt='Hero image'
            className='mt-[-23rem]'
          />
        </div>
        <div className='flex flex-col gap-8'>
          <div>
            <h2 className='text-lg font-semibold text-[#CD44D0]'>Features</h2>
            <p className='text-4xl font-semibold'>
              Access and share your favourites with ease
            </p>
          </div>
          <div className='max-w-68 flex items-center'>
            <Image src='/hero.png' width={630} height={360} alt='Hero image' />
            <div className='mx-8 flex flex-col items-start space-y-1'>
              <h3 className='text-lg font-semibold text-[#CD44D0]'>
                Personalized
              </h3>
              <p className='max-w-prose text-left text-xl font-semibold'>
                Get access to your personalized top tracks and top artists with
                ease
              </p>
              <p className='text-left text-sm text-foreground/80'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
                doloremque culpa a amet laboriosam ut nisi! Tenetur iure,
                corrupti error accusantium, enim quisquam voluptatem, possimus
                nemo quod facilis blanditiis eum.
              </p>
            </div>
          </div>
          <div className='max-w-68 flex flex-row-reverse items-center'>
            <Image src='/hero.png' width={630} height={360} alt='Hero image' />
            <div className='mx-8 flex flex-col items-start space-y-1'>
              <h3 className='text-lg font-semibold text-[#CD44D0]'>
                Personalized
              </h3>
              <p className='max-w-prose text-left text-xl font-semibold'>
                Get access to your personalized top tracks and top artists with
                ease
              </p>
              <p className='text-left text-sm text-foreground/80'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
                doloremque culpa a amet laboriosam ut nisi! Tenetur iure,
                corrupti error accusantium, enim quisquam voluptatem, possimus
                nemo quod facilis blanditiis eum.
              </p>
            </div>
          </div>
          <div className='max-w-68 flex items-center'>
            <Image src='/hero.png' width={630} height={360} alt='Hero image' />
            <div className='mx-8 flex flex-col items-start space-y-1'>
              <h3 className='text-lg font-semibold text-[#CD44D0]'>
                Personalized
              </h3>
              <p className='max-w-prose text-left text-xl font-semibold'>
                Get access to your personalized top tracks and top artists with
                ease
              </p>
              <p className='text-left text-sm text-foreground/80'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
                doloremque culpa a amet laboriosam ut nisi! Tenetur iure,
                corrupti error accusantium, enim quisquam voluptatem, possimus
                nemo quod facilis blanditiis eum.
              </p>
            </div>
          </div>
        </div>
        <div className='my-10 flex h-64 w-full flex-col items-center justify-center space-y-2 rounded-xl bg-[#CD44D0]'>
          <h2 className='text-4xl font-semibold'>Vulse is now in beta</h2>
          <p className='text-foreground/80'>
            Be the first to access the Vulse beta!
          </p>
          <div className='flex w-1/2 gap-4 pt-4'>
            <Input placeholder='Enter your email address...' />
            <Button type='submit'>Join now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
