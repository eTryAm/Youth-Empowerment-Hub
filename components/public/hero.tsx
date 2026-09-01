'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Camera } from 'lucide-react';
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

const fallbackLines = [
  'Empowering Youth.',
  'Building Skills.',
  'Creating Opportunities.',
  'Shaping the Future.',
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  },
};

function headingLinesFromTagline(heading?: string) {
  if (!heading) return fallbackLines;
  const parts = heading
    .split('.')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => (part.endsWith('.') ? part : `${part}.`));
  return parts.length > 0 ? parts : fallbackLines;
}

export function Hero({ heroConfig, platforms = [] }: HeroProps) {
  const headingLines = headingLinesFromTagline(heroConfig?.heading);
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
      url: '/opportunities',
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
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#0A0F1C] gradient-hero py-12 md:py-20 w-full">
      <div className="absolute inset-0 mesh-bg opacity-35 mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-15 pointer-events-none" />

      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 container-custom flex flex-col items-center text-center px-4 w-full max-w-5xl">
        {/* Top Hero Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-6 inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs sm:text-sm text-blue-300 backdrop-blur-sm shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-blue-400 mr-2 animate-pulse" />
          Central Organization Gateway
        </motion.div>

        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 flex flex-col gap-1 w-full"
        >
          {headingLines.map((line) => (
            <motion.span
              key={line}
              variants={itemVariants}
              className="block text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white break-words"
            >
              {line}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-2xl text-sm sm:text-base md:text-lg text-slate-300 mb-8 leading-relaxed font-normal px-2"
        >
          {heroConfig?.subheading ||
            'The primary launchpad connecting youth to independent career portals, digital learning platforms, live event glimpses, and empowerment initiatives.'}
        </motion.p>

        {/* Hero Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto justify-center"
        >
          <Link
            href="/opportunities"
            className="group w-full sm:w-auto flex h-12 sm:h-13 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 px-6 sm:px-7 text-sm sm:text-base font-bold text-white shadow-xl shadow-blue-500/25 transition-all duration-200 cursor-pointer"
          >
            <Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Launch Opportunities Portal</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/gallery"
            className="group w-full sm:w-auto flex h-12 sm:h-13 items-center justify-center gap-2 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 px-5 sm:px-6 text-sm sm:text-base font-semibold text-cyan-200 backdrop-blur-md transition-all duration-200"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
            <span>Event Gallery & Glimpses</span>
          </Link>
          <Link
            href="/platforms"
            className="group w-full sm:w-auto flex h-12 sm:h-13 items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 px-5 sm:px-6 text-sm sm:text-base font-semibold text-white backdrop-blur-md transition-all duration-200"
          >
            <span>All Platforms</span>
          </Link>
        </motion.div>

        {/* Central Gateway Quick Launcher Dock (Integrated Digital Platforms Only) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 sm:mt-10 w-full max-w-4xl p-3.5 sm:p-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-slate-300 mb-3 text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            Quick Launch Ecosystem Platforms:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <Link
              href="/opportunities"
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-blue-600/30 border border-white/10 hover:border-blue-400/50 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform text-base sm:text-lg">
                💼
              </div>
              <div className="overflow-hidden min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white group-hover:text-blue-300 transition-colors truncate">
                  Opportunities Portal
                </div>
                <div className="text-[11px] sm:text-xs text-slate-300 truncate">Ambassadors & Leadership</div>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setActiveModalPlatform(brainstormPlatform)}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-violet-600/30 border border-white/10 hover:border-violet-400/50 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform text-base sm:text-lg">
                🧠
              </div>
              <div className="overflow-hidden min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                  BrainStorm
                </div>
                <div className="text-[11px] sm:text-xs text-slate-300 truncate">Learning & Tech Skills</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveModalPlatform(cricketPlatform)}
              className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-white/10 hover:bg-emerald-600/30 border border-white/10 hover:border-emerald-400/50 transition-all text-left group cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold group-hover:scale-105 transition-transform text-base sm:text-lg">
                🏏
              </div>
              <div className="overflow-hidden min-w-0">
                <div className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                  CricketLive
                </div>
                <div className="text-[11px] sm:text-xs text-slate-300 truncate">Sports & Tournaments</div>
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