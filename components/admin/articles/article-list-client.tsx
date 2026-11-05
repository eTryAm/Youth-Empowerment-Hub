'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Pencil, Trash2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { publishArticle, unpublishArticle, deleteArticle } from '@/lib/actions/articles';

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string | null;
  featured: boolean | null;
  author: string | null;
  publishedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  categoryId: string | null;
  categoryName: string | null;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ArticleListClientProps {
  articles: Article[];
  categories: Category[];
}

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-green-50 text-green-700 border border-green-200',
  draft: 'bg-amber-50 text-amber-700 border border-amber-200',
  archived: 'bg-slate-100 text-slate-600 border border-slate-200',
};

export function ArticleListClient({ articles: initialArticles }: ArticleListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [articles, setArticles] = useState(initialArticles);

  function handlePublish(id: string) {
    startTransition(async () => {
      const result = await publishArticle(id);
      if (result.success) {
        toast.success('Article published.');
        setArticles((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: 'published', publishedAt: a.publishedAt ?? new Date() } : a,
          ),
        );
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to publish.');
      }
    });
  }

  function handleUnpublish(id: string) {
    startTransition(async () => {
      const result = await unpublishArticle(id);
      if (result.success) {
        toast.success('Article moved to draft.');
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: 'draft' } : a)),
        );
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to unpublish.');
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteArticle(id);
      if (result.success) {
        toast.success('Article deleted.');
        setArticles((prev) => prev.filter((a) => a.id !== id));
        setConfirmDelete(null);
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to delete.');
      }
    });
  }

  return (
    <>
      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-base font-bold text-slate-900 mb-2">Delete Article?</h3>
            <p className="text-sm text-slate-500 mb-6">
              This action is permanent and cannot be undone. The article will be removed from the
              public site immediately.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors"
              >
                {isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Author
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Date
                </th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {articles.map((article) => {
                const statusKey = article.status ?? 'draft';
                return (
                  <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900 line-clamp-1 max-w-xs">
                        {article.title}
                      </div>
                      {article.featured && (
                        <span className="inline-block text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-0.5">
                          Featured
                        </span>
                      )}
                      <div className="text-xs text-slate-400 mt-0.5 font-mono">/learn/{article.slug}</div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-slate-600 text-xs">{article.categoryName ?? '—'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[statusKey] ?? STATUS_STYLES.draft}`}
                      >
                        {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-slate-600 text-xs">
                      {article.author ?? '—'}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-slate-500 text-xs whitespace-nowrap">
                      {article.publishedAt
                        ? format(new Date(article.publishedAt), 'dd MMM yyyy')
                        : article.createdAt
                          ? `Draft · ${format(new Date(article.createdAt), 'dd MMM')}`
                          : '—'}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        {/* View on site (published only) */}
                        {statusKey === 'published' && (
                          <a
                            href={`/learn/${article.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View on site"
                            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                        {/* Publish / Unpublish toggle */}
                        {statusKey !== 'published' ? (
                          <button
                            onClick={() => handlePublish(article.id)}
                            disabled={isPending}
                            title="Publish"
                            className="p-2 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 disabled:opacity-50 transition-colors"
                          >
                            <Eye size={15} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnpublish(article.id)}
                            disabled={isPending}
                            title="Unpublish (move to draft)"
                            className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 disabled:opacity-50 transition-colors"
                          >
                            <EyeOff size={15} />
                          </button>
                        )}
                        {/* Edit */}
                        <Link
                          href={`/admin/articles/${article.id}`}
                          title="Edit"
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Pencil size={15} />
                        </Link>
                        {/* Delete */}
                        <button
                          onClick={() => setConfirmDelete(article.id)}
                          title="Delete"
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
