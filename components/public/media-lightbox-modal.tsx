'use client';

import { useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SafeImage } from '@/components/shared/safe-image';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ExternalLink, Video, Image as ImageIcon, Sparkles, Play } from 'lucide-react';
import { format } from 'date-fns';

export interface LightboxMediaItem {
  id: string;
  title: string;
  description?: string | null;
  mediaType: 'image' | 'video' | 'link' | string;
  mediaUrl: string;
  thumbnailUrl?: string | null;
  category?: string | null;
  eventDate?: Date | string | null;
  location?: string | null;
  externalLink?: string | null;
}

interface MediaLightboxModalProps {
  item: LightboxMediaItem | null;
  isOpen: boolean;
  onClose: () => void;
}

// Extract YouTube Video ID from any format (shorts, watch, youtu.be, embed, live)
export function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // 1. YouTube Shorts: youtube.com/shorts/VIDEO_ID
  const shortsMatch = trimmed.match(/(?:youtube\.com|youtu\.be)\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shortsMatch && shortsMatch[1]) return shortsMatch[1];

  // 2. Standard watch URL: youtube.com/watch?v=VIDEO_ID
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?.*v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/live\/|youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/);
  if (watchMatch && watchMatch[1]) return watchMatch[1];

  // 3. Fallback generic 11-char regex for YouTube URLs
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    const genericMatch = trimmed.match(/([a-zA-Z0-9_-]{11})/);
    if (genericMatch && genericMatch[1]) return genericMatch[1];
  }

  return null;
}

// Get fallback thumbnail for any media item
export function getMediaThumbnail(item: LightboxMediaItem): string | null {
  if (item.thumbnailUrl && item.thumbnailUrl.trim()) return item.thumbnailUrl;
  if (item.mediaType === 'image') return item.mediaUrl;
  
  const ytId = getYouTubeId(item.mediaUrl);
  if (ytId) {
    return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }

  return null;
}

// Convert various YouTube / Vimeo / Google Drive / Loom URL formats to embeddable player URLs
export function getUniversalEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // 1. YouTube (Shorts, Watch, Live, Embed)
  const ytId = getYouTubeId(trimmed);
  if (ytId) {
    return `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&enablejsapi=1`;
  }

  // 2. Vimeo
  const vimeoMatch = trimmed.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  // 3. Google Drive
  const gdriveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (gdriveMatch && gdriveMatch[1]) {
    return `https://drive.google.com/file/d/${gdriveMatch[1]}/preview`;
  }

  // 4. Loom
  const loomMatch = trimmed.match(/loom\.com\/(?:share|embed)\/([a-zA-Z0-9_-]+)/);
  if (loomMatch && loomMatch[1]) {
    return `https://www.loom.com/embed/${loomMatch[1]}`;
  }

  return null;
}

export function MediaLightboxModal({ item, isOpen, onClose }: MediaLightboxModalProps) {
  if (!item) return null;

  const isVideo = item.mediaType === 'video';
  const embedUrl = isVideo ? getUniversalEmbedUrl(item.mediaUrl) : null;
  const isDirectVideo = isVideo && !embedUrl && (
    item.mediaUrl.endsWith('.mp4') || 
    item.mediaUrl.endsWith('.webm') || 
    item.mediaUrl.endsWith('.ogg') ||
    item.mediaUrl.endsWith('.mov') ||
    item.mediaUrl.includes('supabase.co/storage')
  );
  const fallbackThumbnail = getMediaThumbnail(item);
  const eventDateObj = item.eventDate ? new Date(item.eventDate) : null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] p-0 bg-[#0A0F1C] border border-white/10 text-white rounded-3xl overflow-hidden shadow-2xl z-50">
        <div className="relative flex flex-col max-h-[90vh] overflow-y-auto">
          {/* Media Player / Image Area */}
          <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
            {isVideo ? (
              embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : isDirectVideo ? (
                <video
                  src={item.mediaUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                  poster={fallbackThumbnail || undefined}
                />
              ) : (
                // Fallback direct iframe & external link launcher
                <div className="relative w-full h-full flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-slate-900 to-black">
                  {fallbackThumbnail && (
                    <SafeImage src={fallbackThumbnail} alt={item.title} fill className="object-cover opacity-20 blur-sm" />
                  )}
                  <div className="relative z-10 space-y-4 max-w-md">
                    <div className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center mx-auto">
                      <Play className="w-8 h-8 fill-cyan-400 ml-1" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-400">Stream clip hosted on external platform</p>
                    </div>
                    <a
                      href={item.mediaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/25 transition-transform hover:scale-105 cursor-pointer"
                    >
                      <span>Play Video Directly in New Tab</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )
            ) : (
              <SafeImage
                src={item.mediaUrl}
                alt={item.title}
                fill
                className="object-contain"
              />
            )}
          </div>

          {/* Details & Caption Area */}
          <div className="p-6 sm:p-8 space-y-4 bg-[#0A0F1C]/95">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {item.category && (
                  <Badge className="bg-blue-600/90 text-white border-0 font-bold px-3 py-1 text-xs rounded-full">
                    {item.category}
                  </Badge>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-cyan-300 border border-white/5">
                  {isVideo ? <Video className="w-3 h-3 text-cyan-400" /> : <ImageIcon className="w-3 h-3 text-blue-400" />}
                  {isVideo ? 'Video Clip' : 'Event Photo'}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                {eventDateObj && !isNaN(eventDateObj.getTime()) && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {format(eventDateObj, 'MMMM d, yyyy')}
                  </span>
                )}
                {item.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {item.location}
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {item.title}
            </h3>

            {item.description && (
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {item.description}
              </p>
            )}

            <div className="flex items-center gap-4 pt-2 flex-wrap">
              {item.externalLink && (
                <a
                  href={item.externalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors group"
                >
                  <span>View Full Event Album & Coverage</span>
                  <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              )}
              {isVideo && (
                <a
                  href={item.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors ml-auto"
                >
                  <span>Open Video URL</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}