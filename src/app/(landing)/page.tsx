import { MoveRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import HeaderText from '~/components/header-text';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Paths } from '~/lib/constants';

export default function Home() {
  return (
    <div className='container my-16 flex max-w-68 items-center justify-center overflow-hidden'>
      <div className='flex w-full flex-col items-center justify-center gap-4 text-center'>
        <div className='flex flex-col items-center justify-center gap-4'>
          <Badge variant='transparent' className='cursor-pointer' size='lg'>
            Vulse beta registration is now open!
            <MoveRight className='ml-1 mt-0.5 h-4 w-4' />
          </Badge>
          <HeaderText />
          <p className='mb-2 mt-0 max-w-[50ch] text-sm text-foreground/80 sm:max-w-full md:mb-4 md:mt-2 md:text-lg lg:text-xl'>
            Get instant access to your personalized Spotify data and share it
            with your friends
          </p>
          <Button asChild>
            <Link href={Paths.Registration}>Get started</Link>
          </Button>
          <div className='mt-0 flex h-[380px] w-screen flex-col items-center justify-center sm:mt-8 sm:h-full sm:w-full'>
            {/* <Image
            src='/hero-gradient.png'
            width={980}
            height={473}
            alt='Hero gradient'
            className='lg:mt-[-5rem] object-cover'
          /> */}
            <Image
              src='/random.png'
              width={1150}
              height={898}
              alt='Hero image'
              className='scale-125 sm:transform-none'
            />
          </div>
        </div>
        <div className='flex flex-col gap-12 pt-8 sm:pt-12'>
          <div>
            <h2 className='font-semibold text-[#CD44D0] md:text-lg'>
              Features
            </h2>
            <p className='text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl'>
              Access and share your favourites <br /> with ease
            </p>
          </div>
          <div className='flex flex-col-reverse items-center pt-8 sm:pt-12 lg:flex-row'>
            <Image
              src='/random.png'
              width={575}
              height={449}
              alt='Hero image'
              className='mt-8'
            />
            <div className='flex flex-col items-start space-y-1 px-2 md:items-center lg:px-8'>
              <h3 className='font-semibold text-[#CD44D0] md:text-lg'>
                Personalized
              </h3>
              <p className='max-w-prose text-left text-xl font-semibold md:text-center lg:text-left'>
                Get access to your personalized top tracks and top artists with
                ease
              </p>
              <p className='max-w-[75ch] text-left text-sm text-foreground/80 md:text-center lg:text-left'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
                doloremque culpa a amet laboriosam ut nisi! Tenetur iure,
                corrupti error accusantium, enim quisquam voluptatem, possimus
                nemo quod facilis blanditiis eum.
              </p>
            </div>
          </div>
          <div className='flex flex-col-reverse items-center pt-8 sm:pt-12 lg:flex-row-reverse'>
            <Image
              src='/random.png'
              width={575}
              height={449}
              alt='Hero image'
              className='mt-8'
            />
            <div className='flex flex-col items-start space-y-1 px-2 md:items-center lg:px-8'>
              <h3 className='font-semibold text-[#CD44D0] md:text-lg'>
                Personalized
              </h3>
              <p className='max-w-prose text-left text-xl font-semibold md:text-center lg:text-right'>
                Get access to your personalized top tracks and top artists with
                ease
              </p>
              <p className='max-w-[75ch] text-left text-sm text-foreground/80 md:text-center lg:text-right'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
                doloremque culpa a amet laboriosam ut nisi! Tenetur iure,
                corrupti error accusantium, enim quisquam voluptatem, possimus
                nemo quod facilis blanditiis eum.
              </p>
            </div>
          </div>
          <div className='flex flex-col-reverse items-center pt-8 sm:pt-12 lg:flex-row'>
            <Image
              src='/random.png'
              width={575}
              height={449}
              alt='Hero image'
              className='mt-8'
            />
            <div className='flex flex-col items-start space-y-1 px-2 md:items-center lg:px-8'>
              <h3 className='font-semibold text-[#CD44D0] md:text-lg'>
                Personalized
              </h3>
              <p className='max-w-prose text-left text-xl font-semibold md:text-center lg:text-left'>
                Get access to your personalized top tracks and top artists with
                ease
              </p>
              <p className='max-w-[75ch] text-left text-sm text-foreground/80 md:text-center lg:text-left'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
                doloremque culpa a amet laboriosam ut nisi! Tenetur iure,
                corrupti error accusantium, enim quisquam voluptatem, possimus
                nemo quod facilis blanditiis eum.
              </p>
            </div>
          </div>
        </div>
        <div className='mb-8 mt-16 flex  h-64 w-full flex-col items-center justify-center space-y-2 rounded-xl bg-[#CD44D0]'>
          <h2 className='text-3xl font-semibold'>Vulse is now in beta</h2>
          <p className='text-foreground/80'>
            Be the first to access the Vulse beta!
          </p>
          <div className='flex w-4/5 gap-4 pt-4 sm:w-3/4 md:w-2/3'>
            <Input placeholder='Enter your email address...' />
            <Button type='submit'>Join now</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
