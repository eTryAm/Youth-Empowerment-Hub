import { redirect } from 'next/navigation';
import { getAdminArticleCategories } from '@/lib/actions/articles';
import { ArticleForm } from '@/components/admin/articles/article-form';
import { requirePermission } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function NewArticlePage() {
  // Guard — only authenticated admins with article creation permission
  await requirePermission('articles.edit');

  const categories = await getAdminArticleCategories();

  return (
    <div className="flex-1 p-4 md:p-8 pt-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">New Article</h1>
        <p className="text-sm text-slate-500 mt-1">
          Create a new article for the Knowledge &amp; Updates section. Save as draft to review
          before publishing.
        </p>
      </div>
      <ArticleForm categories={categories} />
    </div>
  );
}
