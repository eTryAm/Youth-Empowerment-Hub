'use client';

import { useState } from 'react';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { SectionHeader } from '@/components/shared/section-header';
import { PlatformCard, type PlatformCardData } from './platform-card';
import { PlatformIntroModal } from './platform-intro-modal';
import { Sparkles, ArrowRight, Briefcase, Globe } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PlatformsSectionProps {
  platforms: PlatformCardData[];
}

export function PlatformsSection({ platforms = [] }: PlatformsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalPlatform, setActiveModalPlatform] = useState<PlatformCardData | null>(null);

  const categories = ['All', ...Array.from(new Set(platforms.map((p) => p.category).filter(Boolean)))];

  const filteredPlatforms =
    selectedCategory === 'All'
      ? platforms
      : platforms.filter((p) => p.category === selectedCategory);

  const opportunitiesPlatform = platforms.find(
    (p) => p.slug === 'opportunities' || p.name.toLowerCase().includes('opportunities')
  );

  return (
    <SectionWrapper id="platforms" className="bg-slate-50/70 relative">
      <SectionHeader 
        badge="Central Access Gateway" 
        title="Explore Our Digital Ecosystem"
        subtitle="The primary window connecting you to our official portals, career platforms, learning hubs, and community applications."
        centered
      />

      {/* Featured Spotlight: Opportunities Portal */}
      {opportunitiesPlatform && (
        <div className="mb-12 relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-8 md:p-10 text-white shadow-xl border border-blue-500/20">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                Featured Primary Gateway
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Opportunities Portal
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Your direct gateway to curated internships, career development programs, scholarships, and youth application forms hosted directly on our independent Opportunities Platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
              <Button
                onClick={() => setActiveModalPlatform(opportunitiesPlatform)}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold px-8 h-13 rounded-2xl shadow-lg shadow-blue-500/30 border-0"
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Launch Opportunities Portal
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 h-13 rounded-2xl backdrop-blur-sm"
              >
                <Link href="/platforms">
                  <Globe className="w-4 h-4 mr-2" />
                  View All Platforms
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      {categories.length > 2 && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as string)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Platform Cards Grid */}
      {filteredPlatforms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlatforms.map((platform) => (
            <PlatformCard 
              key={platform.id} 
              platform={platform} 
              onOpenIntro={(p) => setActiveModalPlatform(p)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8 max-w-md mx-auto shadow-sm">
          <p className="font-bold text-slate-900 text-lg">No platforms in this category</p>
          <p className="text-sm text-slate-500 mt-1">Select another category to view active platforms.</p>
        </div>
      )}

      {/* Interactive Platform Launch Intro Modal */}
      <PlatformIntroModal
        platform={activeModalPlatform}
        isOpen={Boolean(activeModalPlatform)}
        onClose={() => setActiveModalPlatform(null)}
      />
    </SectionWrapper>
  );
}