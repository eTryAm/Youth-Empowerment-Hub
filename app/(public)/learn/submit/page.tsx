import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SubmitArticleForm } from '@/components/public/submit-article-form';
import { getPublicArticleCategories } from '@/lib/public/queries';

export const metadata: Metadata = {
  title: 'Submit an Article — Knowledge & Updates — Youth Empowerment Hub',
  description:
    'Share your knowledge with the YEH community. Submit an original article on youth development, careers, skills, education or social welfare for editorial review.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function SubmitArticlePage() {
  const categories = await getPublicArticleCategories();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Page Header */}
      <section className="bg-[#0A0F1C] text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-400 mb-5 flex-wrap">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/learn" className="hover:text-white transition-colors">Knowledge &amp; Updates</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-300">Submit an Article</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">Submit an Article</h1>
          <p className="text-slate-300 text-base leading-relaxed max-w-2xl">
            Have insights to share? Submit an original article on youth development, careers, education, 
            skills or social welfare. Our editorial team will review and publish it.
          </p>
        </div>
      </section>

      {/* Form */}
      <div className="flex-1 py-12 px-4">
        <SubmitArticleForm categories={categories} />
      </div>
    </div>
  );
}
