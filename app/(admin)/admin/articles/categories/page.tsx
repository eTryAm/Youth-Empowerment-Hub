import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAdminArticleCategories } from '@/lib/actions/articles';
import { CategoryManager } from '@/components/admin/articles/category-manager';
import { requirePermission } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function ArticleCategoriesPage() {
  await requirePermission('articles.view');
  const categories = await getAdminArticleCategories();

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 max-w-5xl">
      {/* Back link */}
      <Link
        href="/admin/articles"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Articles
      </Link>

      <CategoryManager categories={categories} />
    </div>
  );
}
