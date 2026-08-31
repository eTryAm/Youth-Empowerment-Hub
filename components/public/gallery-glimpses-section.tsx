'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Play, 
  ArrowRight, 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  Video, 
  Camera 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SafeImage } from '@/components/shared/safe-image';
import { MediaLightboxModal, getMediaThumbnail, type LightboxMediaItem } from '@/components/public/media-lightbox-modal';
import { format } from 'date-fns';

interface GalleryGlimpsesSectionProps {
  items?: LightboxMediaItem[];
}

export function GalleryGlimpsesSection({ items = [] }: GalleryGlimpsesSectionProps) {
  const [selectedItem, setSelectedItem] = useState<LightboxMediaItem | null>(null);

  if (!items || items.length === 0) {
    return null;
  }

  // Display top 6 featured glimpses
  const displayItems = items.slice(0, 6);

  return (
    <section className="py-16 md:py-24 bg-[#0A0F1C] text-white relative overflow-hidden w-full">
      {/* Background Glows & Patterns */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />

      <div className="container px-4 md:px-6 mx-auto relative z-10 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 text-xs font-bold uppercase tracking-wider">
              <Camera className="w-3.5 h-3.5 text-cyan-400" />
              Verified Event Highlights & Glimpses
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Event Gallery & Video Highlights
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore authentic snapshots, keynote sessions, student hackathon pitches, and grassroots bootcamps across our programs.
            </p>
          </div>

          <Button
            asChild
            className="w-full sm:w-auto rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-6 h-12 shadow-lg shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
          >
            <Link href="/gallery" className="flex items-center justify-center gap-2">
              <span>Explore All ({items.length}+ Highlights)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Glimpses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
          {displayItems.map((item, index) => {
            const isVideo = item.mediaType === 'video';
            const displayImg = getMediaThumbnail(item);
            const eventDateObj = item.eventDate ? new Date(item.eventDate) : null;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                onClick={() => setSelectedItem(item)}
                className="group relative flex flex-col rounded-3xl overflow-hidden bg-white/[0.04] border border-white/10 hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 cursor-pointer"
              >
                {/* Media Image / Thumbnail */}
                <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                  {displayImg ? (
                    <SafeImage
                      src={displayImg}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500 p-4">
                      {isVideo ? <Video className="w-10 h-10 text-cyan-400/60 mb-2" /> : <ImageIcon className="w-10 h-10 text-blue-400/60 mb-2" />}
                      <span className="text-xs font-semibold">{item.category || 'Glimpse'}</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                  {/* Play Icon Badge for Video */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-cyan-500/90 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950 ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-slate-900 backdrop-blur-md shadow-sm">
                      {item.category || 'Event'}
                    </span>
                    {isVideo && (
                      <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-cyan-600 text-white backdrop-blur-md flex items-center gap-1">
                        <Video className="w-3 h-3" /> Clip
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-1.5 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      {eventDateObj && !isNaN(eventDateObj.getTime()) && (
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {format(eventDateObj, 'MMM yyyy')}
                        </span>
                      )}
                    </div>
                    {item.location && (
                      <span className="flex items-center gap-1 truncate max-w-[140px] sm:max-w-[180px] font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner Trust Callout */}
        <div className="mt-10 sm:mt-14 p-5 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/30 via-cyan-900/20 to-violet-900/30 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
              Youth Empowerment Hub Visual Archive
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Browse through all photo albums, keynote speaker videos, and student project showcases.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto rounded-2xl border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/10 font-bold px-6 h-11 shrink-0 cursor-pointer"
          >
            <Link href="/gallery">Explore Full Gallery &rarr;</Link>
          </Button>
        </div>
      </div>

      {/* Lightbox / Video Player Modal */}
      <MediaLightboxModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
      />
    </section>
  );
}