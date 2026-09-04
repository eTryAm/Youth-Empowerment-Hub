import type { Metadata } from 'next';
import { PageHero } from '@/components/public/page-hero';
import { SectionHeader } from '@/components/shared/section-header';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { getPublicPlatforms } from '@/lib/public/queries';
import { PlatformsDirectory } from '@/components/public/platforms-directory';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/json-ld';
import { webPageSchema } from '@/components/seo/schema';

export const metadata: Metadata = {
  title: 'Digital Ecosystem & Platforms — Youth Empowerment Hub',
  description:
    'Access the unified digital platforms of Youth Empowerment Hub — Opportunities Portal for campus ambassadors and volunteers, BrainStorm for learning and tech, and CricketLive for live sports tournament management.',
  keywords: [
    'youth platforms India',
    'youth empowerment ecosystem',
    'opportunities portal youth',
    'campus ambassador portal',
    'volunteer opportunities portal',
    'brainstorm youth platform',
    'cricket live sports portal',
  ],
  alternates: { canonical: '/platforms' },
  openGraph: {
    title: 'Digital Ecosystem & Platforms — Youth Empowerment Hub',
    description:
      'Unified digital platforms powering career opportunities, tech education, and sports management for youth.',
    url: '/platforms',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Youth Empowerment Hub Platforms' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Digital Ecosystem & Platforms — Youth Empowerment Hub',
    description: 'Explore all digital portals and platforms for youth empowerment.',
    images: ['/og-image.jpg'],
  },
};

export default async function PlatformsPage() {
  const allPlatforms = await getPublicPlatforms();

  return (
    <div className="flex flex-col">
      <JsonLd
        data={webPageSchema({
          name: 'Digital Ecosystem & Platforms — Youth Empowerment Hub',
          description:
            'Access the unified digital platforms designed to support youth across careers, education, sports, and community development.',
          url: 'https://youthempowerment.in/platforms',
          breadcrumb: [
            { name: 'Home', url: 'https://youthempowerment.in' },
            { name: 'Platforms', url: 'https://youthempowerment.in/platforms' },
          ],
        })}
      />
      <PageHero
        title="Integrated Digital Ecosystem"
        subtitle="The central window and access point for all official portals, applications, and services operated by the Youth Empowerment Hub."
      />

      <SectionWrapper className="bg-slate-50/70 py-12 md:py-16">
        <SectionHeader 
          badge="Live Platforms Directory"
          title="All Ecosystem Platforms" 
          subtitle="Explore the directory of services. Click any platform to view an introduction and launch directly to the platform."
          centered
        />

        <div className="mt-8">
          <PlatformsDirectory platforms={allPlatforms} />
        </div>

        {/* Integration Call to Action */}
        <div className="mt-16 rounded-3xl bg-white border border-slate-200 p-8 md:p-10 text-center shadow-sm max-w-4xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto font-bold">
            <PlusCircle className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Need to Integrate a New Platform?</h3>
          <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed">
            Our modular digital architecture enables administrators and partner initiatives to connect custom domains, tools, and digital platforms seamlessly into this central hub.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl">
              <Link href="/contact?category=Partnership">Request Platform Integration</Link>
            </Button>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}