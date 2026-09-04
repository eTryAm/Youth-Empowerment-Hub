import type { Metadata } from 'next';
import { SafeImage } from '@/components/shared/safe-image';
import Link from 'next/link';
import { PageHero } from '@/components/public/page-hero';
import { OutboundGate } from '@/components/public/outbound-gate';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { getPublicInitiatives } from '@/lib/public/queries';
import { isExternalHref } from '@/lib/utils';
import { JsonLd } from '@/components/seo/json-ld';
import { webPageSchema } from '@/components/seo/schema';

export const metadata: Metadata = {
  title: 'Initiatives & Programs — Youth Empowerment Hub',
  description:
    'Explore Youth Empowerment Hub initiatives and youth programs across India — digital literacy drives, skill bootcamps, community volunteering, sports development, entrepreneurship mentorship, and youth leadership campaigns.',
  keywords: [
    'youth initiatives India',
    'youth empowerment programs',
    'skill development initiatives',
    'youth campaigns India',
    'community youth programs',
    'youth innovation projects',
  ],
  alternates: { canonical: '/initiatives' },
  openGraph: {
    title: 'Initiatives & Programs — Youth Empowerment Hub',
    description:
      'Explore programs and campaigns empowering young people across education, technology, sports, and leadership.',
    url: '/initiatives',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Youth Empowerment Hub Initiatives' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Initiatives & Programs — Youth Empowerment Hub',
    description: 'Explore youth programs and campaigns driving impact across India.',
    images: ['/og-image.jpg'],
  },
};

export default async function InitiativesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const allInitiatives = await getPublicInitiatives();
  const categories = Array.from(
    new Set(allInitiatives.map((item) => item.category).filter(Boolean) as string[])
  );
  const filteredInitiatives = category
    ? allInitiatives.filter(
        (item) => item.category?.toLowerCase() === category.toLowerCase()
      )
    : allInitiatives;

  return (
    <div className="flex flex-col bg-slate-50">
      <JsonLd
        data={webPageSchema({
          name: 'Initiatives & Programs — Youth Empowerment Hub',
          description:
            'Explore Youth Empowerment Hub initiatives and programs across India.',
          url: 'https://youthempowerment.in/initiatives',
          breadcrumb: [
            { name: 'Home', url: 'https://youthempowerment.in' },
            { name: 'Initiatives', url: 'https://youthempowerment.in/initiatives' },
          ],
        })}
      />
      <PageHero
        title="Our Initiatives"
        subtitle="Discover the programs and campaigns we are running to empower youth."
      />

      <SectionWrapper>
        <div className="flex gap-4 mb-12 overflow-x-auto pb-4">
          <Link
            href="/initiatives"
            className={`px-6 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
              !category ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All
          </Link>
          {categories.map((item) => (
            <Link
              key={item}
              href={`/initiatives?category=${encodeURIComponent(item)}`}
              className={`px-6 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                category?.toLowerCase() === item.toLowerCase()
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {item}
            </Link>
          ))}
        </div>

        {filteredInitiatives.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInitiatives.map((init) => {
              const href = init.ctaUrl;
              return (
                <div
                  key={init.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-shadow group flex flex-col"
                >
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    <SafeImage
                      src={init.imageUrl || ''}
                      alt={init.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {init.category ? (
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm border border-slate-200/60 z-10">
                        {init.category}
                      </div>
                    ) : null}
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{init.title}</h3>
                    <p className="text-slate-600 mb-6 flex-1">{init.description}</p>
                    {href ? (
                      isExternalHref(href) ? (
                        <OutboundGate
                          title={init.title}
                          description={init.description}
                          href={href}
                          urlType="external"
                          fallbackHref="/contact"
                          ctaLabel={init.ctaText || 'Learn More'}
                        />
                      ) : (
                        <Link href={href} className="text-blue-600 font-semibold hover:text-blue-700">
                          {init.ctaText || 'Learn More'} →
                        </Link>
                      )
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 border-dashed">
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No initiatives found</h3>
            <p className="text-slate-500">We could not find any initiatives matching your criteria at this time.</p>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
}
