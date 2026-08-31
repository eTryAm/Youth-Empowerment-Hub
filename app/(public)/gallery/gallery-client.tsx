'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Play, 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  Video, 
  Camera, 
  ExternalLink,
  Layers,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SafeImage } from '@/components/shared/safe-image';
import { MediaLightboxModal, getMediaThumbnail, type LightboxMediaItem } from '@/components/public/media-lightbox-modal';
import { format } from 'date-fns';

interface GalleryClientProps {
  initialItems: LightboxMediaItem[];
}

const CATEGORIES = [
  'All',
  'Events',
  'Hackathons',
  'Workshops',
  'Fellowships',
  'Youth Summits',
  'Community',
];

export function GalleryClient({ initialItems = [] }: GalleryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'image' | 'video'>('all');
  const [selectedItem, setSelectedItem] = useState<LightboxMediaItem | null>(null);

  const filteredItems = initialItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType =
      mediaTypeFilter === 'all' ||
      (mediaTypeFilter === 'image' && item.mediaType === 'image') ||
      (mediaTypeFilter === 'video' && item.mediaType === 'video');
    return matchesCat && matchesType;
  });

  return (
    <div className="space-y-10">
      {/* Category & Media Type Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 p-2.5 sm:p-2 bg-slate-100/90 rounded-3xl border border-slate-200/80 w-full overflow-hidden">
        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 scrollbar-hide max-w-full">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Media Type Toggles */}
        <div className="flex items-center gap-1.5 px-1 py-1 shrink-0 flex-wrap">
          <button
            onClick={() => setMediaTypeFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              mediaTypeFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            All ({initialItems.length})
          </button>
          <button
            onClick={() => setMediaTypeFilter('image')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              mediaTypeFilter === 'image'
                ? 'bg-white text-blue-600 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> Photos
          </button>
          <button
            onClick={() => setMediaTypeFilter('video')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              mediaTypeFilter === 'video'
                ? 'bg-white text-cyan-600 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" /> Videos
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredItems.map((item, index) => {
              const isVideo = item.mediaType === 'video';
              const displayImg = getMediaThumbnail(item);
              const eventDateObj = item.eventDate ? new Date(item.eventDate) : null;

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  onClick={() => setSelectedItem(item)}
                  className="group relative flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-200/90 hover:border-blue-300 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
                >
                  {/* Media Cover Image */}
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
                        {isVideo ? (
                          <Video className="w-10 h-10 text-cyan-400/70 mb-2" />
                        ) : (
                          <ImageIcon className="w-10 h-10 text-blue-400/70 mb-2" />
                        )}
                        <span className="text-xs font-semibold">{item.category || 'Glimpse'}</span>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-70 group-hover:opacity-50 transition-opacity" />

                    {/* Video Play Button */}
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-cyan-500/95 text-slate-950 flex items-center justify-center shadow-xl shadow-cyan-500/40 group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950 ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Category & Type Pills */}
                    <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5">
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-white/95 text-slate-900 backdrop-blur-md shadow-sm">
                        {item.category || 'Event'}
                      </span>
                      {isVideo && (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-cyan-600 text-white backdrop-blur-md flex items-center gap-1 shadow-sm">
                          <Video className="w-3 h-3" /> Video
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Caption & Metadata */}
                  <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="mt-2 text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1">
                        {eventDateObj && !isNaN(eventDateObj.getTime()) && (
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {format(eventDateObj, 'MMMM yyyy')}
                          </span>
                        )}
                      </div>
                      {item.location && (
                        <span className="flex items-center gap-1 truncate max-w-[160px]">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center shadow-sm space-y-3">
          <Camera className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-lg font-bold text-slate-900">No media found for this category</h4>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try switching to another category tab or check back soon for updated event moments.
          </p>
        </div>
      )}

      {/* Lightbox / Video Player Modal */}
      <MediaLightboxModal
        item={selectedItem}
        isOpen={Boolean(selectedItem)}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}