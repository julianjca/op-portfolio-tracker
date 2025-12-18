import { Geist } from 'next/font/google';

import { QueryProvider } from '@/providers/query-provider';

import type { Metadata } from 'next';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'One Piece TCG Portfolio Tracker',
  description: 'Track your One Piece TCG card collection, monitor portfolio value, and connect with other collectors.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={geistSans.variable}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
