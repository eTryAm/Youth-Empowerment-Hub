import type { Metadata } from 'next';
import { Camera, Video, Sparkles, Award, Users } from 'lucide-react';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { getPublicGalleryItems } from '@/lib/public/queries';
import { GalleryClient } from './gallery-client';

export const metadata: Metadata = {
  title: 'Gallery & Event Glimpses | Youth Empowerment Hub',
  description: 'Explore photos, video clips, and glimpses of youth hackathons, innovation summits, workshops, and community events.',
};

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const items = await getPublicGalleryItems();

  const photoCount = items.filter((i) => i.mediaType === 'image').length;
  const videoCount = items.filter((i) => i.mediaType === 'video').length;

  return (
    <div className="flex flex-col">
      {/* Rich Gallery Hero Section */}
      <section className="relative overflow-hidden bg-[#0A0F1C] text-white px-4 pt-16 pb-16 md:pt-24 md:pb-20">
        <div className="absolute inset-0 mesh-bg opacity-30 mix-blend-screen pointer-events-none" />
        <div className="absolute inset-0 dot-pattern opacity-15 pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            Official Visual Showcase & Glimpses
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
            Event Gallery & Video Highlights
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Experience the real energy, youth innovations, live hackathon pitches, and community bootcamps happening across the Youth Empowerment Hub ecosystem.
          </p>

          {/* Quick Metrics Pills */}
          <div className="pt-4 flex items-center justify-center flex-wrap gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-300">
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Camera className="w-4 h-4 text-blue-400" />
              <span>{photoCount}+ Event Photos</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Video className="w-4 h-4 text-cyan-400" />
              <span>{videoCount}+ Video Clips & Demos</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Hackathons & Fellowships</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Showcase Content */}
      <SectionWrapper className="bg-slate-50/70 py-12 md:py-20 min-h-[600px]">
        <GalleryClient initialItems={items} />
      </SectionWrapper>
    </div>
  );
}