'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { SafeImage } from '@/components/shared/safe-image';
import { cn } from '@/lib/utils';

export type PlatformCardData = {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  longDescription?: string | null;
  url?: string | null;
  status?: string | null;
  category?: string | null;
  coverImageUrl?: string | null;
  logoUrl?: string | null;
  accentColor?: string | null;
  ctaText?: string | null;
  openInNewTab?: boolean | null;
  featured?: boolean | null;
};

const STATUS_LABELS: Record<string, string> = {
  live: 'Live & Active',
  coming_soon: 'Coming Soon',
  under_development: 'In Development',
  temporarily_unavailable: 'Maintenance',
};

interface PlatformCardProps {
  platform: PlatformCardData;
  onOpenIntro?: (platform: PlatformCardData) => void;
}

export function PlatformCard({ platform, onOpenIntro }: PlatformCardProps) {
  const status = platform.status ?? 'live';
  const isLive = status === 'live';
  const imageSrc = platform.coverImageUrl || platform.logoUrl;
  const isOpportunities =
    platform.slug === 'opportunities' || platform.name.toLowerCase().includes('opportunities');

  const handleClick = (e: React.MouseEvent) => {
    if (onOpenIntro) {
      e.preventDefault();
      onOpenIntro(platform);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      onClick={handleClick}
      className={cn(
        'group relative flex flex-col rounded-3xl border bg-white overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full cursor-pointer',
        isOpportunities
          ? 'border-blue-300 ring-2 ring-blue-500/20 shadow-blue-500/10'
          : 'border-slate-200 hover:border-blue-300'
      )}
    >
      {/* Header Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        {imageSrc ? (
          <SafeImage
            src={imageSrc}
            alt={platform.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: platform.accentColor
                ? `linear-gradient(135deg, ${platform.accentColor} 0%, #0A0F1C 100%)`
                : 'linear-gradient(135deg, #1E3A8A 0%, #0A0F1C 100%)',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
          {platform.category ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-white/90 text-slate-900 shadow-sm backdrop-blur-md">
              {platform.category}
            </span>
          ) : (
            <span />
          )}

          <span
            className={cn(
              'px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border shadow-xs',
              isLive
                ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400/40'
                : 'bg-amber-500/30 text-amber-300 border-amber-400/40'
            )}
          >
            {STATUS_LABELS[status] ?? status}
          </span>
        </div>

        {/* Title over dark overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          {isOpportunities && (
            <span className="text-[11px] font-bold uppercase tracking-widest text-blue-300 mb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Core Gateway Platform
            </span>
          )}
          <h3 className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">
            {platform.name}
          </h3>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-grow p-6">
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
          {platform.description ||
            platform.longDescription ||
            'Access features, services, applications, and opportunities directly on this platform.'}
        </p>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleClick}
          className={cn(
            'inline-flex items-center justify-center w-full gap-2 px-5 py-3.5 text-sm font-bold rounded-2xl transition-all duration-200 shadow-sm',
            isOpportunities
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25 hover:shadow-md'
              : isLive
              ? 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
          )}
        >
          <span>Launch & Overview</span>
          <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}