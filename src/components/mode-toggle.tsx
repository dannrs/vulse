'use client';

import { Computer, ComputerIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { useEffect, useState } from 'react';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

const ModeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const toggleTheme = (theme: string) => {
    setTheme(theme);
  };

  return (
    <div className='flex rounded-full border p-0.5 gap-1'>
      <Button
        variant={resolvedTheme === 'light' ? 'default' : 'ghost'}
        size='xs'
        onClick={() => toggleTheme('light')}
        className={cn(
          `${resolvedTheme === 'light' ? 'bg-accent hover:bg-accent' : 'bg-transparent'}`,
          'rounded-full text-foreground'
        )}
      >
        <Sun className='h-4 w-4' />
        <span className='sr-only'>Toggle light mode</span>
      </Button>
      <Button
        variant={resolvedTheme === 'system' ? 'default' : 'ghost'}
        size='xs'
        onClick={() => toggleTheme('system')}
        className={cn(
          `${resolvedTheme === 'system' ? 'bg-accent hover:bg-accent' : 'bg-transparent'}`,
          'rounded-full text-foreground'
        )}
      >
        <Computer className='h-4 w-4' />
        <span className='sr-only'>Toggle system theme</span>
      </Button>

      <Button
        variant={resolvedTheme === 'dark' ? 'default' : 'ghost'}
        size='xs'
        onClick={() => toggleTheme('system')}
        className={cn(
          `${resolvedTheme === 'dark' ? 'bg-accent hover:bg-accent' : 'bg-transparent'}`,
          'rounded-full text-foreground'
        )}
      >
        <Moon className='h-4 w-4' />
        <span className='sr-only'>Toggle dark mode</span>
      </Button>
    </div>
  );
};

export default ModeToggle;
