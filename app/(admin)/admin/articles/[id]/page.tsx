import { notFound } from 'next/navigation';
import { getAdminArticleById, getAdminArticleCategories } from '@/lib/actions/articles';
import { ArticleForm } from '@/components/admin/articles/article-form';
import { PublicationEmailCard } from '@/components/admin/articles/publication-email-card';
import { requirePermission } from '@/lib/auth';
import { getSiteUrl } from '@/lib/site-url';
import { getPublicationEmailAvailability } from '@/lib/email/publication-email';

export const dynamic = 'force-dynamic';

interface EditArticlePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  await requirePermission('articles.edit');

  const { id } = await params;
  const [article, categories] = await Promise.all([
    getAdminArticleById(id),
    getAdminArticleCategories(),
  ]);

  if (!article) notFound();

  const emailAvailability = getPublicationEmailAvailability();
  const articleUrl = new URL(`/learn/${encodeURIComponent(article.slug)}`, getSiteUrl()).toString();

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Edit Article</h1>
        <p className="text-sm text-slate-500 mt-1 font-mono">/learn/{article.slug}</p>
      </div>
      <ArticleForm
        categories={categories}
        initialData={{
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          categoryId: article.categoryId,
          featuredImageUrl: article.featuredImageUrl,
          featuredImageAlt: article.featuredImageAlt,
          author: article.author,
          seoTitle: article.seoTitle,
          seoDescription: article.seoDescription,
          status: article.status as 'draft' | 'published' | 'archived',
          featured: article.featured ?? false,
          readingTimeMinutes: article.readingTimeMinutes,
        }}
      />
      <div className="mt-6">
        <PublicationEmailCard
          articleId={article.id}
          articleTitle={article.title}
          articleUrl={articleUrl}
          articleStatus={article.status}
          submitterName={article.submittedByName}
          submitterEmail={article.submittedByEmail}
          emailStatus={article.publicationEmailStatus}
          emailSentAt={article.publicationEmailSentAt}
          emailLastAttemptedAt={article.publicationEmailLastAttemptedAt}
          emailFailureReason={article.publicationEmailFailureReason}
          resendConfigured={emailAvailability.configured}
          configurationReason={emailAvailability.reason}
        />
      </div>
    </div>
  );
}
