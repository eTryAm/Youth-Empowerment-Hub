'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, Sparkles, Briefcase, Camera } from 'lucide-react';
import Link from 'next/link';
import { PlatformIntroModal } from '@/components/public/platform-intro-modal';
import type { PlatformCardData } from '@/components/public/platform-card';

interface HeroConfig {
  heading?: string;
  subheading?: string;
}

interface HeroProps {
  heroConfig?: HeroConfig;
  platforms?: PlatformCardData[];
}

export function Hero({ heroConfig, platforms = [] }: HeroProps) {
  const [activeModalPlatform, setActiveModalPlatform] = useState<PlatformCardData | null>(null);

  const opportunitiesPlatform =
    platforms.find(
      (p) => p.slug === 'opportunities' || p.name.toLowerCase().includes('opportunities')
    ) || {
      id: 'opp-default',
      name: 'Opportunities Portal',
      slug: 'opportunities',
      category: 'Careers & Opportunities',
      status: 'live',
      description:
        'Our official platform for verified internship listings, scholarship applications, and youth career opportunities.',
      url: '/platforms',
      accentColor: '#2563EB',
    };

  const brainstormPlatform =
    platforms.find((p) => p.slug === 'brainstorm' || p.name.toLowerCase().includes('brain')) || {
      id: 'brain-default',
      name: 'BrainStorm',
      slug: 'brainstorm',
      category: 'Learning & Technology',
      status: 'live',
      description:
        'Interactive skill challenges, coding labs, AI workshops, and technical hackathons for youth.',
      url: 'https://brainstorm.example.com',
      accentColor: '#7C3AED',
    };

  const cricketPlatform =
    platforms.find((p) => p.slug === 'cricketlive' || p.name.toLowerCase().includes('cricket')) || {
      id: 'cricket-default',
      name: 'CricketLive',
      slug: 'cricketlive',
      category: 'Sports & Tournaments',
      status: 'live',
      description:
        'Live match tracking, youth cricket leagues, player statistics, and athletic coaching tournaments.',
      url: 'https://cricketlive.example.com',
      accentColor: '#059669',
    };

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white py-16 md:py-24 w-full border-b border-slate-100">
      {/* Background Ambience */}
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 container-custom flex flex-col items-center text-center px-4 w-full max-w-5xl">
        {/* Prominent Independence Status Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50 px-4 py-1.5 text-xs sm:text-sm font-bold text-emerald-800 shadow-xs backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>INDEPENDENT STUDENT-LED INITIATIVE</span>
        </motion.div>

        {/* Main Inspiring Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 max-w-4xl leading-[1.15]"
        >
          {heroConfig?.heading || 'Empowering Young Minds to Learn, Participate & Grow.'}
        </motion.h1>

        {/* Transparent Supporting Message */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="max-w-3xl text-sm sm:text-base md:text-lg text-slate-600 mb-8 sm:mb-10 leading-relaxed font-normal px-2"
        >
          {heroConfig?.subheading ||
            'Youth Empowerment Hub is an independent student-led initiative creating opportunities for young people to develop skills, discover possibilities, participate in meaningful activities and grow together.'}
        </motion.p>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto justify-center"
        >
          <Link
            href="/get-involved"
            className="group w-full sm:w-auto flex h-12 sm:h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 px-7 sm:px-8 text-sm sm:text-base font-bold text-white shadow-xl shadow-blue-500/20 transition-all duration-200 cursor-pointer"
          >
            <span>Join the Initiative</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <a
            href="#what-we-build"
            className="group w-full sm:w-auto flex h-12 sm:h-13 items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 px-6 sm:px-7 text-sm sm:text-base font-semibold text-slate-800 shadow-xs transition-all duration-200"
          >
            <Compass className="w-4 h-4 text-cyan-600" />
            <span>Explore What We Do</span>
          </a>

          <Link
            href="/gallery"
            className="group w-full sm:w-auto flex h-12 sm:h-13 items-center justify-center gap-2 rounded-2xl border border-cyan-200 bg-cyan-50/80 hover:bg-cyan-100/80 px-5 sm:px-6 text-sm sm:text-base font-semibold text-cyan-900 shadow-xs transition-all duration-200"
          >
            <Camera className="w-4 h-4 text-cyan-600" />
            <span>Activity Glimpses</span>
          </Link>
        </motion.div>

        {/* Central Ecosystem Platform Quick Launch Dock */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-12 sm:mt-14 w-full max-w-4xl p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/50"
        >
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            Quick Launch Digital Ecosystem:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setActiveModalPlatform(opportunitiesPlatform)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-300 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform text-base sm:text-lg">
                💼
              </div>
              <div className="overflow-hidden min-w-0">
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                  Opportunities Portal
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 truncate">Campus Ambassadors & Roles</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveModalPlatform(brainstormPlatform)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 hover:bg-violet-50/80 border border-slate-200/80 hover:border-violet-300 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform text-base sm:text-lg">
                🧠
              </div>
              <div className="overflow-hidden min-w-0">
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-violet-700 transition-colors truncate">
                  BrainStorm
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 truncate">Skills, Coding & Labs</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveModalPlatform(cricketPlatform)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 hover:bg-emerald-50/80 border border-slate-200/80 hover:border-emerald-300 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform text-base sm:text-lg">
                🏏
              </div>
              <div className="overflow-hidden min-w-0">
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                  CricketLive
                </div>
                <div className="text-[11px] sm:text-xs text-slate-500 truncate">Sports & Tournaments</div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Interactive Platform Launch Intro Modal */}
      <PlatformIntroModal
        platform={activeModalPlatform}
        isOpen={Boolean(activeModalPlatform)}
        onClose={() => setActiveModalPlatform(null)}
      />
    </section>
  );
}