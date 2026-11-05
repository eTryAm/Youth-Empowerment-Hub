import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { ArticleCard } from '@/components/public/article-card';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbSchema } from '@/components/seo/schema';
import {
  getPublishedArticlesByCategorySlug,
  getPublicArticleCategories,
} from '@/lib/public/queries';
import { getSiteUrl } from '@/lib/site-url';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const categories = await getPublicArticleCategories();
  const cat = categories.find((c) => c.slug === slug);

  if (!cat) return { title: 'Category Not Found' };

  const articles = await getPublishedArticlesByCategorySlug(slug);
  const hasArticles = articles.length > 0;

  return {
    title: `${cat.name} — Knowledge & Updates — YEH`,
    description:
      cat.description ||
      `Browse all published articles in the ${cat.name} category on Youth Empowerment Hub.`,
    alternates: { canonical: `/learn/category/${slug}` },
    robots: hasArticles ? { index: true } : { index: false },
    openGraph: {
      title: `${cat.name} — Knowledge & Updates`,
      description:
        cat.description ||
        `Explore ${cat.name} articles published by the YEH team.`,
      url: `/learn/category/${slug}`,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: `${cat.name} — YEH` }],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: slug } = await params;

  // Validate the category exists
  const categories = await getPublicArticleCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const articles = await getPublishedArticlesByCategorySlug(slug);
  const baseUrl = getSiteUrl();

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Knowledge & Updates', url: `${baseUrl}/learn` },
    { name: cat.name, url: `${baseUrl}/learn/category/${slug}` },
  ]);

  return (
    <div className="flex flex-col">
      <JsonLd data={breadcrumb} />

      {/* Hero */}
      <PageHero
        title={cat.name}
        subtitle={cat.description || `Browse all articles in this category.`}
      />

      <SectionWrapper>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-8 flex-wrap">
          <Link href="/" className="hover:text-slate-800 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/learn" className="hover:text-slate-800 transition-colors">Knowledge &amp; Updates</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-800 font-medium">{cat.name}</span>
        </nav>

        {/* Article Grid */}
        {articles.length > 0 ? (
          <>
            <p className="text-sm text-slate-500 mb-6">
              {articles.length} {articles.length === 1 ? 'article' : 'articles'} in this category
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
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
          </>
        ) : (
          <div className="text-center py-24 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">No Articles Yet</h2>
            <p className="text-slate-500 max-w-sm mx-auto text-sm">
              No published articles in this category yet. Check back soon or explore other updates.
            </p>
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
            >
              ← Back to Knowledge &amp; Updates
            </Link>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
}
