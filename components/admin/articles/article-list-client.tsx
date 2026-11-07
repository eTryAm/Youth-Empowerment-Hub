'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Pencil, Trash2, Eye, EyeOff, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';
import {
  publishArticle,
  unpublishArticle,
  deleteArticle,
  reviewArticle,
} from '@/lib/actions/articles';

interface Article {
  id: string;
  title: string;
  slug: string;
  status: string | null;
  featured: boolean | null;
  author: string | null;
  submittedByName: string | null;
  submittedByEmail: string | null;
  publicationEmailStatus?: string | null;
  viewCount: number | null;
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

type Filter = 'all' | 'published' | 'pending_review' | 'draft' | 'archived' | 'rejected';

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-green-50 text-green-700 border border-green-200',
  draft: 'bg-amber-50 text-amber-700 border border-amber-200',
  archived: 'bg-slate-100 text-slate-600 border border-slate-200',
  pending_review: 'bg-orange-50 text-orange-700 border border-orange-200',
  rejected: 'bg-red-50 text-red-600 border border-red-200',
};

const STATUS_LABELS: Record<string, string> = {
  published: 'Published',
  draft: 'Draft',
  archived: 'Archived',
  pending_review: 'Pending Review',
  rejected: 'Rejected',
};

export function ArticleListClient({ articles: initialArticles }: ArticleListClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');
  const [articles, setArticles] = useState(initialArticles);
  const [activeFilter, setActiveFilter] = useState<Filter>('all');

  const pendingCount = articles.filter((a) => a.status === 'pending_review').length;

  const filtered =
    activeFilter === 'all'
      ? articles
      : articles.filter((a) => (a.status ?? 'draft') === activeFilter);

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
        setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, status: 'draft' } : a)));
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to unpublish.');
      }
    });
  }

  function handleApprove(id: string) {
    startTransition(async () => {
      const result = await reviewArticle(id, 'approve');
      if (result.success) {
        toast.success('Article approved and published.');
        setArticles((prev) =>
          prev.map((a) =>
            a.id === id ? { ...a, status: 'published', publishedAt: new Date() } : a,
          ),
        );
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to approve.');
      }
    });
  }

  function handleReject(id: string) {
    startTransition(async () => {
      const result = await reviewArticle(id, 'reject', rejectNote.trim() || undefined);
      if (result.success) {
        toast.success('Article rejected.');
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: 'rejected' } : a)),
        );
        setRejectingId(null);
        setRejectNote('');
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to reject.');
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

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending_review', label: `Pending Review${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
    { key: 'published', label: 'Published' },
    { key: 'draft', label: 'Drafts' },
    { key: 'archived', label: 'Archived' },
    { key: 'rejected', label: 'Rejected' },
  ];

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

      {/* Reject with note modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-base font-bold text-slate-900 mb-2">Reject Submission</h3>
            <p className="text-sm text-slate-500 mb-4">
              Optionally add a note explaining the reason. This is stored internally.
            </p>
            <textarea
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              rows={3}
              placeholder="e.g. Content does not meet quality guidelines, too short, off-topic…"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-red-400 mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setRejectingId(null); setRejectNote(''); }}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingId)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors"
              >
                {isPending ? 'Rejecting…' : 'Reject Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
              activeFilter === f.key
                ? f.key === 'pending_review'
                  ? 'bg-orange-500 text-white'
                  : 'bg-blue-600 text-white'
                : f.key === 'pending_review' && pendingCount > 0
                  ? 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Article table */}
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
                  Author / Submitter
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">
                  Views
                </th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                  Date
                </th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400">
                    No articles in this category.
                  </td>
                </tr>
              )}
              {filtered.map((article) => {
                const statusKey = article.status ?? 'draft';
                const isPending = statusKey === 'pending_review';
                return (
                  <tr key={article.id} className={`hover:bg-slate-50 transition-colors ${isPending ? 'bg-orange-50/30' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900 line-clamp-1 max-w-xs">
                        {article.title}
                      </div>
                      {article.featured && (
                        <span className="inline-block text-[10px] font-bold text-amber-600 uppercase tracking-widest mt-0.5">
                          Featured
                        </span>
                      )}
                      {isPending && article.submittedByEmail && (
                        <div className="text-[11px] text-orange-600 mt-0.5">
                          📬 {article.submittedByEmail}
                        </div>
                      )}
                      {!isPending && article.submittedByEmail && statusKey === 'published' && (
                        <div className="text-[11px] mt-0.5">
                          {article.publicationEmailStatus === 'sent' ? (
                            <span className="text-green-600 font-medium">✓ Author notified</span>
                          ) : article.publicationEmailStatus === 'failed' ? (
                            <span className="text-red-500 font-medium">⚠ Email failed</span>
                          ) : (
                            <span className="text-blue-600 font-medium">✉ Author not notified</span>
                          )}
                        </div>
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
                        {STATUS_LABELS[statusKey] ?? statusKey}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-slate-600 text-xs">
                      {isPending && article.submittedByName
                        ? `Submitted by ${article.submittedByName}`
                        : (article.author ?? '—')}
                    </td>
                    <td className="px-4 py-4 hidden xl:table-cell text-slate-500 text-xs">
                      {article.viewCount != null && article.viewCount > 0 ? (
                        <span className="flex items-center gap-1">
                          <Eye size={12} className="text-slate-400" />
                          {article.viewCount.toLocaleString('en-IN')}
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
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

                        {/* Pending review — Approve + Reject */}
                        {isPending && (
                          <>
                            <button
                              onClick={() => handleApprove(article.id)}
                              disabled={isPending as unknown as boolean}
                              title="Approve & Publish"
                              className="p-2 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 disabled:opacity-50 transition-colors"
                            >
                              <CheckCircle2 size={15} />
                            </button>
                            <button
                              onClick={() => setRejectingId(article.id)}
                              title="Reject"
                              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <XCircle size={15} />
                            </button>
                          </>
                        )}

                        {/* Publish / Unpublish toggle for non-pending */}
                        {!isPending && statusKey !== 'published' && (
                          <button
                            onClick={() => handlePublish(article.id)}
                            disabled={isPending as unknown as boolean}
                            title="Publish"
                            className="p-2 rounded-lg text-slate-400 hover:text-green-600 hover:bg-green-50 disabled:opacity-50 transition-colors"
                          >
                            <Eye size={15} />
                          </button>
                        )}
                        {!isPending && statusKey === 'published' && (
                          <button
                            onClick={() => handleUnpublish(article.id)}
                            disabled={isPending as unknown as boolean}
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
