import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Youth Empowerment Hub — Empowering Youth. Building Skills. Creating Opportunities.',
    template: '%s | Youth Empowerment Hub',
  },
  description:
    'Empowering young people through education, skills, technology, opportunities, innovation, sports, community development, and social welfare.',
  keywords: [
    'youth empowerment',
    'education',
    'skill development',
    'technology',
    'career opportunities',
    'entrepreneurship',
    'innovation',
    'digital literacy',
    'community development',
  ],
  authors: [{ name: 'Youth Empowerment Hub' }],
  creator: 'Youth Empowerment Hub',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'Youth Empowerment Hub',
    title: 'Youth Empowerment Hub — Empowering Youth. Building Skills. Creating Opportunities.',
    description:
      'Empowering young people through education, skills, technology, opportunities, innovation, sports, community development, and social welfare.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Youth Empowerment Hub',
    description:
      'Empowering young people through education, skills, technology, opportunities, innovation, sports, community development, and social welfare.',
  },
  icons: {
    icon: '/images/logo.png',
    shortcut: '/images/logo.png',
    apple: '/images/logo.png',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--color-surface-card)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            },
          }}
        />
      </body>
    </html>
  );
}
