'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { ChevronRight, Send, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import { submitArticleForReview } from '@/lib/actions/articles';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface SubmitFormProps {
  categories: Category[];
}

export function SubmitArticleForm({ categories }: SubmitFormProps) {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  // honeypot
  const [honeypot, setHoneypot] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Honeypot — silently succeed without saving
    if (honeypot) {
      setSubmitted(true);
      setSubmittedEmail(email);
      return;
    }

    startTransition(async () => {
      const result = await submitArticleForReview({
        submittedByName: name,
        submittedByEmail: email,
        title,
        categoryId: categoryId === 'other' ? null : categoryId || null,
        customCategoryName: categoryId === 'other' ? customCategory.trim() : null,
        excerpt: excerpt || undefined,
        contentPlaintext: content,
      });

      if (result.success) {
        setSubmitted(true);
        setSubmittedEmail(email);
      } else {
        setError(result.error ?? 'Something went wrong. Please try again.');
      }
    });
  }

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center max-w-xl mx-auto">
        <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-black text-slate-900 mb-2">Thank you for your submission!</h2>
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Your article has been submitted for review by the YEH editorial team. We will email you at{' '}
          <span className="font-semibold text-slate-800">{submittedEmail}</span> once it has been
          reviewed — usually within a few days.
        </p>
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Back to Knowledge &amp; Updates
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* Your Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          About You
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              placeholder="e.g. Priya Sharma"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Your Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-slate-400 mt-1">We&apos;ll notify you when your article is reviewed.</p>
          </div>
        </div>
      </div>

      {/* Article Details */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Article Details
        </h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Article Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            placeholder="e.g. How to Build a Strong Resume as a Fresh Graduate"
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">— Select a category (optional) —</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
            <option value="other">✨ Other (Specify your own category)...</option>
          </select>
        </div>

        {categoryId === 'other' && (
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2">
            <label className="block text-sm font-semibold text-blue-950">
              Specify Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              required={categoryId === 'other'}
              maxLength={100}
              placeholder="e.g. Design & Creative Arts, Mental Wellness, Sports..."
              className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-blue-700">
              Tell us the topic or category your article belongs to. Our editorial team will assign or create it.
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Short Summary{' '}
            <span className="text-xs text-slate-400 font-normal">(optional, max 400 characters)</span>
          </label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            maxLength={400}
            rows={2}
            placeholder="1–2 sentences describing what your article is about."
            className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-400 mt-1 text-right">{excerpt.length}/400</p>
        </div>
      </div>

      {/* Article Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            Article Content <span className="text-red-500">*</span>
          </h2>
          <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-800 mb-4 space-y-1">
            <p className="font-semibold">📝 Write in plain text — no HTML needed</p>
            <ul className="text-xs text-blue-700 space-y-0.5 list-disc list-inside mt-1">
              <li>Leave a blank line between paragraphs</li>
              <li>Write headings on their own line (they will be formatted automatically)</li>
              <li>Use plain numbers for lists (1. 2. 3.)</li>
              <li>Minimum 80 characters</li>
            </ul>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            minLength={80}
            maxLength={50000}
            rows={20}
            placeholder={`Write your article here in plain text.

Just leave a blank line between paragraphs — no HTML or formatting codes needed.

For example:

Introduction

Youth today face more opportunities than ever before, but navigating them is not always easy.

Why This Matters

According to recent surveys, over 70% of students feel they lack proper career guidance...`}
            className="w-full border border-slate-200 rounded-xl px-3.5 py-3 text-sm text-slate-900 resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono leading-relaxed"
          />
          <p className="text-xs text-slate-400 mt-1 flex justify-between">
            <span>Plain text only. Our team will format and review your article before publishing.</span>
            <span>{content.length.toLocaleString()}/50,000</span>
          </p>
        </div>
      </div>

      {/* Honeypot — hidden from humans, bots fill it */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Guidelines */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-sm text-amber-900 space-y-2">
        <p className="font-bold">📋 Submission Guidelines</p>
        <ul className="text-xs space-y-1 list-disc list-inside text-amber-800">
          <li>Content must be original — no plagiarism</li>
          <li>Relevant to youth development, education, careers, skills or social welfare</li>
          <li>No promotional content, spam or inappropriate material</li>
          <li>The YEH editorial team reserves the right to edit, format or decline submissions</li>
          <li>Submitting means you agree that YEH may publish your article on this website</li>
        </ul>
      </div>

      {/* Submit */}
      <div className="flex items-center justify-between gap-4 pb-6">
        <Link
          href="/learn"
          className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isPending || !name || !email || !title || content.length < 80}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors"
        >
          <Send className="w-4 h-4" />
          {isPending ? 'Submitting…' : 'Submit Article for Review'}
        </button>
      </div>
    </form>
  );
}
