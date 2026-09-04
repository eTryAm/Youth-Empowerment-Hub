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
    'Youth Empowerment Hub (YEH) is India\'s platform for youth empowerment — offering skill development programs, career opportunities, digital literacy, entrepreneurship support, community development, and sports initiatives for young people across India.',
  keywords: [
    // Core brand
    'youth empowerment hub',
    'YEH',
    'youth empowerment India',
    'youth development organization India',
    'youth NGO India',
    // Education & Skills
    'skill development for youth India',
    'youth education programs',
    'digital literacy for youth',
    'entrepreneurship for youth',
    'career opportunities for students',
    'campus ambassador program India',
    'internship opportunities India',
    'youth vocational training',
    // Community
    'youth community development',
    'youth volunteer program India',
    'youth leadership program',
    'represent your state program',
    'district representative youth',
    // Sports
    'youth sports development India',
    'youth sports organization',
    'sports tournament youth',
    // Technology & Innovation
    'youth technology platform',
    'youth innovation hub',
    'youth hackathon India',
    'youth startup ecosystem',
    // General
    'youth programs India',
    'empower youth',
    'youth welfare organization',
    'young people development',
    'youth schemes India',
  ],
  authors: [{ name: 'Youth Empowerment Hub', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://youthempowerment.in' }],
  creator: 'Youth Empowerment Hub',
  publisher: 'Youth Empowerment Hub',
  category: 'Education & Youth Development',
  classification: 'Non-Profit Organization',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://youthempowerment.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Youth Empowerment Hub',
    title: 'Youth Empowerment Hub — Empowering Youth. Building Skills. Creating Opportunities.',
    description:
      'India\'s platform for youth empowerment — skill development, career opportunities, digital literacy, entrepreneurship, sports, and community development for young people.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Youth Empowerment Hub — Empowering Youth. Building Skills. Creating Opportunities.',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Youth Empowerment Hub — Empowering Youth. Building Skills. Creating Opportunities.',
    description:
      'India\'s platform for youth empowerment — skill development, career opportunities, digital literacy, and community development.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png',      sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png',      sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here:
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-code',
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
