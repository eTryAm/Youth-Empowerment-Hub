import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, ChevronRight, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { ArticleCard } from '@/components/public/article-card';
import { JsonLd } from '@/components/seo/json-ld';
import { breadcrumbSchema } from '@/components/seo/schema';
import {
  getPublishedArticleBySlug,
  getRelatedArticles,
} from '@/lib/public/queries';
import { getSiteUrl } from '@/lib/site-url';

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found' };

  const baseUrl = getSiteUrl();
  const title = article.seoTitle || article.title;
  const description =
    article.seoDescription || article.excerpt || `Read "${article.title}" on the YEH Learning Hub.`;

  return {
    title: `${title} — YEH Learning Hub`,
    description,
    alternates: { canonical: `/learn/${slug}` },
    openGraph: {
      title: `${title} — YEH Learning Hub`,
      description,
      url: `/learn/${slug}`,
      type: 'article',
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: article.updatedAt?.toISOString(),
      authors: [article.author ?? 'YEH Editorial Team'],
      images: article.featuredImageUrl
        ? [{ url: article.featuredImageUrl, width: 1200, height: 630, alt: title }]
        : [{ url: '/og-image.jpg', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} — YEH Learning Hub`,
      description,
      images: [article.featuredImageUrl || '/og-image.jpg'],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug);
  if (!article) notFound();

  const relatedArticles = await getRelatedArticles(article.id, article.categoryId ?? null, 3);
  const baseUrl = getSiteUrl();

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt ?? undefined,
    image: article.featuredImageUrl ?? `${baseUrl}/og-image.jpg`,
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt?.toISOString(),
    author: {
      '@type': 'Person',
      name: article.author ?? 'YEH Editorial Team',
    },
    publisher: {
      '@id': `${baseUrl}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/learn/${slug}`,
    },
    isPartOf: { '@id': `${baseUrl}/#website` },
  };

  const breadcrumb = breadcrumbSchema([
    { name: 'Home', url: baseUrl },
    { name: 'Learning Hub', url: `${baseUrl}/learn` },
    ...(article.categoryName && article.categorySlug
      ? [{ name: article.categoryName, url: `${baseUrl}/learn/category/${article.categorySlug}` }]
      : []),
    { name: article.title, url: `${baseUrl}/learn/${slug}` },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <JsonLd data={[articleSchema, breadcrumb]} />

      {/* Hero / Header */}
      <section className="bg-[#0A0F1C] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/learn" className="hover:text-white transition-colors">Learning Hub</Link>
            {article.categoryName && article.categorySlug && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/learn/category/${article.categorySlug}`} className="hover:text-white transition-colors">
                  {article.categoryName}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-300 truncate max-w-[200px]">{article.title}</span>
          </nav>

          {article.categoryName && (
            <span className="inline-block text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">
              {article.categoryName}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight mb-6">{article.title}</h1>

          {article.excerpt && (
            <p className="text-lg text-slate-300 leading-relaxed mb-6 max-w-3xl">{article.excerpt}</p>
          )}

          {/* Meta row */}
          <div className="flex items-center flex-wrap gap-5 text-sm text-slate-400">
            {article.author && (
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                {article.author}
              </span>
            )}
            {article.publishedAt && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {format(new Date(article.publishedAt), 'dd MMMM yyyy')}
              </span>
            )}
            {article.updatedAt && article.publishedAt &&
              article.updatedAt.getTime() - article.publishedAt.getTime() > 86_400_000 && (
              <span className="text-xs text-slate-500">
                Updated {format(new Date(article.updatedAt), 'dd MMM yyyy')}
              </span>
            )}
            {article.readingTimeMinutes && (
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.readingTimeMinutes} min read
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {article.featuredImageUrl && (
        <div className="relative w-full max-w-4xl mx-auto -mt-0 overflow-hidden aspect-video bg-slate-100">
          <Image
            src={article.featuredImageUrl}
            alt={article.featuredImageAlt ?? article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      )}

      {/* Article Content */}
      <SectionWrapper className="max-w-4xl mx-auto w-full">
        {article.content ? (
          <div
            className="prose prose-slate prose-lg max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:leading-relaxed prose-p:text-slate-700
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-code:bg-slate-100 prose-code:text-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
              prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-2xl prose-pre:overflow-x-auto
              prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
              prose-ul:text-slate-700 prose-ol:text-slate-700
              prose-img:rounded-2xl prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        ) : (
          <div className="text-center py-16 text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Article content is being prepared.</p>
          </div>
        )}

        {/* Back to hub */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
          >
            ← Back to Learning Hub
          </Link>
        </div>
      </SectionWrapper>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <SectionWrapper className="bg-slate-50">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <ArticleCard
                key={rel.id}
                title={rel.title}
                slug={rel.slug}
                excerpt={rel.excerpt}
                featuredImageUrl={rel.featuredImageUrl}
                author={rel.author}
                publishedAt={rel.publishedAt}
                readingTimeMinutes={rel.readingTimeMinutes}
                categoryName={rel.categoryName}
                categorySlug={rel.categorySlug}
                size="compact"
              />
            ))}
          </div>
        </SectionWrapper>
      )}
    </div>
  );
}
