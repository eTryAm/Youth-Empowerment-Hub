'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { createArticle, updateArticle } from '@/lib/actions/articles';
import { cleanImageUrl } from '@/lib/image-url';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ArticleFormData {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string | null;
  categoryId?: string | null;
  featuredImageUrl?: string | null;
  featuredImageAlt?: string | null;
  author?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  status?: 'draft' | 'published' | 'archived';
  featured?: boolean;
  readingTimeMinutes?: number | null;
}

interface ArticleFormProps {
  categories: Category[];
  initialData?: ArticleFormData;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 320);
}

function plaintextToHtml(text: string): string {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paragraphs.map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`).join('\n');
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ArticleForm({ categories, initialData }: ArticleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = Boolean(initialData?.id);

  const [title, setTitle] = useState(initialData?.title ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '');
  const [content, setContent] = useState(initialData?.content ?? '');
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? '');
  const [featuredImageUrl, setFeaturedImageUrl] = useState(initialData?.featuredImageUrl ?? '');
  const [featuredImageAlt, setFeaturedImageAlt] = useState(initialData?.featuredImageAlt ?? '');
  const [author, setAuthor] = useState(initialData?.author ?? 'YEH Editorial Team');
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle ?? '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seoDescription ?? '');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(
    initialData?.status ?? 'draft',
  );
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [readingTimeMinutes, setReadingTimeMinutes] = useState<string>(
    initialData?.readingTimeMinutes?.toString() ?? '',
  );
  const [contentMode, setContentMode] = useState<'plain' | 'html'>(
    initialData?.content && initialData.content.includes('<') ? 'html' : 'plain',
  );
  const [imageError, setImageError] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setSlug(value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let finalContent = content;
    if (contentMode === 'plain' && content && !content.includes('<p') && !content.includes('<div')) {
      finalContent = plaintextToHtml(content);
    }

    let calculatedReadingTime = readingTimeMinutes ? parseInt(readingTimeMinutes, 10) : null;
    if (!calculatedReadingTime && content) {
      const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
      calculatedReadingTime = Math.max(1, Math.round(words / 200));
    }

    const payload = {
      title,
      slug,
      excerpt: excerpt || null,
      content: finalContent || null,
      categoryId: categoryId || null,
      featuredImageUrl: cleanImageUrl(featuredImageUrl) || null,
      featuredImageAlt: featuredImageAlt || null,
      author: author || 'YEH Editorial Team',
      seoTitle: seoTitle || null,
      seoDescription: seoDescription || null,
      status,
      featured,
      readingTimeMinutes: calculatedReadingTime,
    };

    startTransition(async () => {
      const result = isEditing
        ? await updateArticle(initialData!.id!, payload)
        : await createArticle(payload);

      if (result.success) {
        toast.success(isEditing ? 'Article updated.' : 'Article created.');
        router.push('/admin/articles');
        router.refresh();
      } else {
        toast.error(result.error ?? 'Something went wrong.');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
          Article Details
        </h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            maxLength={300}
            placeholder="Article title"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Slug <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0">/learn/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              required
              maxLength={320}
              placeholder="article-url-slug"
              pattern="^[a-z0-9-]+$"
              className="flex-1 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">Lowercase letters, numbers and hyphens only.</p>
        </div>

        {/* Category */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-slate-700">Category</label>
            <Link
              href="/admin/articles/categories"
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              + Manage categories
            </Link>
          </div>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">— No category —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {categories.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">
              No categories yet.{' '}
              <Link href="/admin/articles/categories" className="underline font-medium">
                Create one first
              </Link>
              , then come back to this form.
            </p>
          )}
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            maxLength={150}
            placeholder="YEH Editorial Team"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Excerpt{' '}
            <span className="text-xs text-slate-400 font-normal">(max 600 characters)</span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            maxLength={600}
            rows={3}
            placeholder="A short summary displayed in article cards and search results."
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">{excerpt.length}/600</p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
          <h2 className="text-base font-semibold text-slate-900">Article Content</h2>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            <button
              type="button"
              onClick={() => setContentMode('plain')}
              className={`px-3 py-1 rounded-md transition-colors ${
                contentMode === 'plain'
                  ? 'bg-white text-blue-600 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📝 Easy Plain Text (Recommended)
            </button>
            <button
              type="button"
              onClick={() => setContentMode('html')}
              className={`px-3 py-1 rounded-md transition-colors ${
                contentMode === 'html'
                  ? 'bg-white text-blue-600 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💻 HTML Mode
            </button>
          </div>
        </div>

        {contentMode === 'plain' ? (
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs text-blue-800 space-y-1">
            <p className="font-semibold">💡 Plain Text Mode Active</p>
            <p>
              Type naturally like an article or email. Leave an empty line between paragraphs.
              Formatting is applied automatically when saving.
            </p>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 space-y-1">
            <p className="font-semibold">⚙️ Advanced HTML Mode Active</p>
            <p>Use standard HTML tags (&lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, etc.). Scripts will be safely sanitized.</p>
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          placeholder={
            contentMode === 'plain'
              ? `Introduction\n\nYouth today have tremendous opportunities, but guidance is essential.\n\nKey Recommendations\n\n1. Focus on core technical skills.\n2. Participate in hackathons and volunteer projects.\n\nConclusion\n\nStart small and be consistent.`
              : `<h2>Introduction</h2>\n<p>Write your article content here with HTML tags.</p>`
          }
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-mono text-slate-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent leading-relaxed"
        />
        <p className="text-xs text-slate-400">
          Content is sanitized before being displayed on public pages to ensure complete security.
        </p>
      </div>

      {/* Media & Reading Time */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
          Featured Image
        </h2>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-slate-700">Image URL</label>
            <span className="text-xs text-slate-400">Supports direct image links (.jpg, .png, Unsplash, Pexels)</span>
          </div>
          <input
            type="url"
            value={featuredImageUrl}
            onChange={(e) => {
              const cleaned = cleanImageUrl(e.target.value);
              setFeaturedImageUrl(cleaned || '');
              setImageError(false);
            }}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-400 mt-1">
            💡 <strong>Tip:</strong> For Google or Bing image search, right-click the image and choose <em>&quot;Copy Image Address&quot;</em>.
          </p>

          {/* Live Image Preview */}
          {featuredImageUrl && (
            <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className={imageError ? 'text-red-600' : 'text-green-600'}>
                  {imageError ? '⚠️ Image failed to load — check the link' : '✓ Live Image Preview'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setFeaturedImageUrl('');
                    setImageError(false);
                  }}
                  className="text-slate-400 hover:text-red-500 text-xs"
                >
                  Remove
                </button>
              </div>
              <div className="relative aspect-video w-full max-w-sm rounded-lg overflow-hidden bg-slate-200 border border-slate-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredImageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                  onLoad={() => setImageError(false)}
                />
              </div>
              {imageError && (
                <p className="text-xs text-red-600 leading-relaxed">
                  The link provided does not point directly to an image file or the host blocks hotlinking.
                  Please paste a direct image URL (e.g. from{' '}
                  <a
                    href="https://unsplash.com"
                    target="_blank"
                    rel="noreferrer"
                    className="underline font-bold"
                  >
                    Unsplash
                  </a>{' '}
                  or right-click an image and copy its address).
                </p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Image Alt Text{' '}
            <span className="text-xs text-slate-400 font-normal">(for accessibility)</span>
          </label>
          <input
            type="text"
            value={featuredImageAlt}
            onChange={(e) => setFeaturedImageAlt(e.target.value)}
            maxLength={200}
            placeholder="Describe the image"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Reading Time{' '}
            <span className="text-xs text-slate-400 font-normal">
              (minutes — leave blank to auto-calculate)
            </span>
          </label>
          <input
            type="number"
            value={readingTimeMinutes}
            onChange={(e) => setReadingTimeMinutes(e.target.value)}
            min={1}
            max={120}
            placeholder="e.g. 5"
            className="w-36 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-5">
        <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
          SEO{' '}
          <span className="text-xs font-normal text-slate-400">
            (optional — defaults to article title/excerpt)
          </span>
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            SEO Title <span className="text-xs text-slate-400 font-normal">(max 80 chars)</span>
          </label>
          <input
            type="text"
            value={seoTitle}
            onChange={(e) => setSeoTitle(e.target.value)}
            maxLength={80}
            placeholder="Leave blank to use article title"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">{seoTitle.length}/80</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            SEO Description{' '}
            <span className="text-xs text-slate-400 font-normal">(max 200 chars)</span>
          </label>
          <textarea
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            maxLength={200}
            rows={2}
            placeholder="Leave blank to use excerpt"
            className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">{seoDescription.length}/200</p>
        </div>
      </div>

      {/* Publish Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3">
          Publish Settings
        </h2>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'archived')}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="draft">Draft — not visible to public</option>
              <option value="published">Published — visible to public</option>
              <option value="archived">Archived — hidden from public</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="featured" className="text-sm font-medium text-slate-700 cursor-pointer">
              Mark as Featured
              <span className="block text-xs text-slate-400 font-normal">
                Featured articles appear at the top of the Knowledge &amp; Updates page.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between gap-4 pb-8">
        <button
          type="button"
          onClick={() => router.push('/admin/articles')}
          className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending || !title || !slug}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
        >
          {isPending
            ? isEditing
              ? 'Saving…'
              : 'Creating…'
            : isEditing
              ? 'Save Changes'
              : 'Create Article'}
        </button>
      </div>
    </form>
  );
}
