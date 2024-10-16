import '~/styles/globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { SessionProvider } from '~/components/session-provider';
import { ThemeProvider } from '~/components/theme-provider';
import { validateRequest } from '~/lib/auth/validate-request';
import { cn } from '~/lib/utils';
import { TRPCReactProvider } from '~/trpc/react';
import { Toaster } from '~/components/ui/sonner';
import { env } from '~/env';
import { config } from './config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: {
    default: config.site.name,
    template: `%s - ${config.site.name}`,
  },
  description: config.site.description,
  authors: [
    {
      name: 'danniramdhani',
      url: 'https://danni.my.id',
    },
  ],
  creator: 'danniramdhani',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionData = await validateRequest();

  return (
    <html lang='en'>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider value={sessionData}>
            <TRPCReactProvider>{children}</TRPCReactProvider>
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
