import Link from 'next/link';
import { Plus, FileText, Tag } from 'lucide-react';
import { getAdminArticles, getAdminArticleCategories } from '@/lib/actions/articles';
import { ArticleListClient } from '@/components/admin/articles/article-list-client';

export const dynamic = 'force-dynamic';

export default async function AdminArticlesPage() {
  const [articles, categories] = await Promise.all([
    getAdminArticles(),
    getAdminArticleCategories(),
  ]);

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Knowledge &amp; Updates</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage articles and announcements published on the public Knowledge &amp; Updates section.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/admin/articles/categories"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg transition-colors"
          >
            <Tag size={15} />
            Categories
            {categories.length > 0 && (
              <span className="ml-0.5 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded-full">
                {categories.length}
              </span>
            )}
          </Link>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus size={16} />
            New Article
          </Link>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: articles.length, color: 'text-slate-900' },
          {
            label: 'Published',
            count: articles.filter((a) => a.status === 'published').length,
            color: 'text-green-600',
          },
          {
            label: 'Pending Review',
            count: articles.filter((a) => a.status === 'pending_review').length,
            color: 'text-orange-600',
          },
          {
            label: 'Drafts',
            count: articles.filter((a) => a.status === 'draft' || !a.status).length,
            color: 'text-amber-600',
          },
        ].map(({ label, count, color }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 px-5 py-4">
            <p className={`text-2xl font-black ${color}`}>{count}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Article list */}
      {articles.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-slate-900 mb-1">No articles yet</h3>
          <p className="text-sm text-slate-500 mb-6">
            Create your first article to publish it on the Knowledge &amp; Updates section.
          </p>
          <Link
            href="/admin/articles/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus size={16} />
            Create Article
          </Link>
        </div>
      ) : (
        <ArticleListClient articles={articles} categories={categories} />
      )}
    </div>
  );
}
