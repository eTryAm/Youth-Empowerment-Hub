import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  title: string;
  slug: string;
  excerpt?: string | null;
  featuredImageUrl?: string | null;
  author?: string | null;
  publishedAt?: Date | null;
  readingTimeMinutes?: number | null;
  categoryName?: string | null;
  categorySlug?: string | null;
  featured?: boolean;
  className?: string;
  size?: 'default' | 'compact';
}

export function ArticleCard({
  title,
  slug,
  excerpt,
  featuredImageUrl,
  author,
  publishedAt,
  readingTimeMinutes,
  categoryName,
  categorySlug,
  featured,
  className,
  size = 'default',
}: ArticleCardProps) {
  return (
    <Link
      href={`/learn/${slug}`}
      className={cn(
        'group flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 overflow-hidden',
        className
      )}
    >
      {/* Featured Image */}
      {featuredImageUrl ? (
        <div className="relative overflow-hidden bg-slate-100 aspect-video">
          <Image
            src={featuredImageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {featured && (
            <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow">
              Featured
            </span>
          )}
        </div>
      ) : (
        <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 aspect-video flex items-center justify-center">
          <BookOpen className="w-12 h-12 text-blue-200" />
          {featured && (
            <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow">
              Featured
            </span>
          )}
        </div>
      )}

      <div className={cn('flex flex-col flex-1 p-5', size === 'compact' && 'p-4')}>
        {/* Category */}
        {categoryName && (
          <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
            {categoryName}
          </span>
        )}

        {/* Title */}
        <h3
          className={cn(
            'font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2',
            size === 'default' ? 'text-lg' : 'text-base'
          )}
        >
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && size === 'default' && (
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">{excerpt}</p>
        )}

        {/* Meta footer */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            {publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {format(new Date(publishedAt), 'dd MMM yyyy')}
              </span>
            )}
            {readingTimeMinutes && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {readingTimeMinutes} min read
              </span>
            )}
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
        </div>
      </div>
    </Link>
  );
}
