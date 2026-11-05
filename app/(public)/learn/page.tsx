import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { ArticleCard } from '@/components/public/article-card';
import { JsonLd } from '@/components/seo/json-ld';
import { webPageSchema } from '@/components/seo/schema';
import { getPublishedArticles } from '@/lib/public/queries';
import { getSiteUrl } from '@/lib/site-url';

export const metadata: Metadata = {
  title: 'Knowledge & Updates — Youth Empowerment Hub',
  description:
    'Insights, announcements and updates from the YEH team. Stay informed about youth development, initiatives, opportunities and more.',
  keywords: [
    'youth empowerment updates',
    'YEH blog',
    'student development articles',
    'youth initiatives India',
    'skill development insights',
    'young people opportunities',
  ],
  alternates: { canonical: '/learn' },
  openGraph: {
    title: 'Knowledge & Updates — Youth Empowerment Hub',
    description:
      'Insights, announcements and updates from the YEH team.',
    url: '/learn',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Knowledge & Updates — YEH' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Knowledge & Updates — YEH',
    description: 'Insights and updates from the Youth Empowerment Hub team.',
    images: ['/og-image.jpg'],
  },
};

export default async function KnowledgePage() {
  const [featuredArticles, latestArticles] = await Promise.all([
    getPublishedArticles({ featuredOnly: true, limit: 3 }),
    getPublishedArticles({ limit: 9 }),
  ]);

  const baseUrl = getSiteUrl();

  return (
    <div className="flex flex-col">
      <JsonLd
        data={webPageSchema({
          name: 'Knowledge & Updates — Youth Empowerment Hub',
          description:
            'Insights, announcements and updates from the YEH team.',
          url: `${baseUrl}/learn`,
          breadcrumb: [
            { name: 'Home', url: baseUrl },
            { name: 'Knowledge & Updates', url: `${baseUrl}/learn` },
          ],
        })}
      />

      {/* Hero */}
      <PageHero
        title="Knowledge & Updates"
        subtitle="Insights, guides and announcements from the YEH team — stay informed about youth development, initiatives and opportunities."
      />

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <SectionWrapper className="bg-slate-50">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900">Featured</h2>
            <p className="text-slate-500 mt-1 text-sm">Editor-picked articles and announcements</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                slug={article.slug}
                excerpt={article.excerpt}
                featuredImageUrl={article.featuredImageUrl}
                author={article.author}
                publishedAt={article.publishedAt}
                readingTimeMinutes={article.readingTimeMinutes}
                categoryName={article.categoryName}
                categorySlug={article.categorySlug}
                featured
              />
            ))}
          </div>
        </SectionWrapper>
      )}

      {/* Latest Articles */}
      <SectionWrapper>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900">Latest Articles</h2>
            <p className="text-slate-500 mt-1 text-sm">Recently published guides and updates</p>
          </div>
          {latestArticles.length >= 9 && (
            <Link
              href="/learn?all=1"
              className="hidden sm:flex items-center gap-1.5 text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors shrink-0"
            >
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {latestArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestArticles.map((article) => (
              <ArticleCard
                key={article.id}
                title={article.title}
                slug={article.slug}
                excerpt={article.excerpt}
                featuredImageUrl={article.featuredImageUrl}
                author={article.author}
                publishedAt={article.publishedAt}
                readingTimeMinutes={article.readingTimeMinutes}
                categoryName={article.categoryName}
                categorySlug={article.categorySlug}
                featured={article.featured ?? false}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Articles Coming Soon</h3>
            <p className="text-slate-500 max-w-sm mx-auto text-sm">
              We are preparing content for this section. In the meantime, explore our platforms and
              grab opportunities from the Opportunity Portal.
            </p>
            <Link
              href="/platforms"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              Explore Platforms <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
}
