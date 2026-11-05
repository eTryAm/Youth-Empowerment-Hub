import { notFound } from 'next/navigation';
import { getAdminArticleById, getAdminArticleCategories } from '@/lib/actions/articles';
import { ArticleForm } from '@/components/admin/articles/article-form';
import { requirePermission } from '@/lib/auth';

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
    </div>
  );
}
