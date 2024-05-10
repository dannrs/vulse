'use client';

import { Computer, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

const ModeToggle = () => {
  const { setTheme, theme } = useTheme();

  const toggleTheme = (theme: string) => {
    setTheme(theme);
  };

  return (
    <div className='flex rounded-full border p-0.5 gap-1'>
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size='xs'
        onClick={() => toggleTheme('light')}
        className={cn(
          `${theme === 'light' ? 'bg-accent hover:bg-accent' : 'bg-transparent'}`,
          'rounded-full text-foreground'
        )}
      >
        <Sun className='h-4 w-4' />
        <span className='sr-only'>Toggle light mode</span>
      </Button>
      <Button
        variant={theme === 'system' ? 'default' : 'ghost'}
        size='xs'
        onClick={() => toggleTheme('system')}
        className={cn(
          `${theme === 'system' ? 'bg-accent hover:bg-accent' : 'bg-transparent'}`,
          'rounded-full text-foreground'
        )}
      >
        <Computer className='h-4 w-4' />
        <span className='sr-only'>Toggle system theme</span>
      </Button>

      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size='xs'
        onClick={() => toggleTheme('dark')}
        className={cn(
          `${theme === 'dark' ? 'bg-accent hover:bg-accent' : 'bg-transparent'}`,
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
