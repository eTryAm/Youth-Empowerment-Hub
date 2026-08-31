'use client';

import { useState } from 'react';
import { PlatformCard, type PlatformCardData } from './platform-card';
import { PlatformIntroModal } from './platform-intro-modal';
import { Sparkles, ArrowRight, Briefcase, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlatformsDirectoryProps {
  platforms: PlatformCardData[];
}

export function PlatformsDirectory({ platforms = [] }: PlatformsDirectoryProps) {
  const [activeModalPlatform, setActiveModalPlatform] = useState<PlatformCardData | null>(null);

  const opportunitiesPlatform = platforms.find(
    (p) => p.slug === 'opportunities' || p.name.toLowerCase().includes('opportunities')
  );

  return (
    <>
      {/* Spotlight Gateway Banner */}
      {opportunitiesPlatform && (
        <div className="mb-14 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-8 sm:p-10 text-white shadow-xl relative overflow-hidden border border-blue-500/30">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                Featured Central Portal
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                Opportunities Portal
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Connect directly to verified internships, scholarships, skill fellowships, and employment programs. All listings and application forms are hosted directly on the Opportunities Platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
              <Button
                onClick={() => setActiveModalPlatform(opportunitiesPlatform)}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-8 h-12 rounded-2xl shadow-lg border-0 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Launch Opportunities Portal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Platform Grid */}
      {platforms.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {platforms.map((platform) => (
            <PlatformCard
              key={platform.id}
              platform={platform}
              onOpenIntro={(p) => setActiveModalPlatform(p)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
          <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">Ecosystem Expanding</h3>
          <p className="text-slate-600 text-sm">New platforms created via the Admin CMS will appear here dynamically.</p>
        </div>
      )}

      {/* Modal Window for All Platforms */}
      <PlatformIntroModal
        platform={activeModalPlatform}
        isOpen={Boolean(activeModalPlatform)}
        onClose={() => setActiveModalPlatform(null)}
      />
    </>
  );
}