'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Brain, Briefcase, Users, Award, ExternalLink, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { PlatformIntroModal } from '@/components/public/platform-intro-modal';
import type { PlatformCardData } from '@/components/public/platform-card';

interface EcosystemBuildingProps {
  platforms?: PlatformCardData[];
}

const ecosystemPillars = [
  {
    title: 'Events & Competitions',
    status: 'Available Now',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Quizzes, debates, technical hackathons, workshops, creative challenges, and athletic tournaments organized for youth.',
    icon: Calendar,
    link: '/events',
    linkText: 'View Events Calendar',
  },
  {
    title: 'Skills & Learning',
    status: 'Available Now',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Practical exposure to coding, emerging technologies, communication, design thinking, and interpersonal capabilities.',
    icon: Brain,
    link: '/platforms',
    linkText: 'Explore Learning Labs',
  },
  {
    title: 'Opportunities & Projects',
    status: 'In Development',
    statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Curated internships, real-world open source projects, campus ambassador roles, and community-led initiatives.',
    icon: Briefcase,
    link: '/platforms',
    linkText: 'Opportunities Gateway',
  },
  {
    title: 'Student Community',
    status: 'Available Now',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'A welcoming, active network of students, campus leaders, volunteers, and regional chapter representatives.',
    icon: Users,
    link: '/get-involved',
    linkText: 'Join the Network',
  },
  {
    title: 'Recognition & Records',
    status: 'Coming Next',
    statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'Verifiable participation records, digital credential badges, and merit recognitions for outstanding contributors.',
    icon: Award,
    link: '/about',
    linkText: 'Learn About Verification',
  },
];

export function EcosystemBuildingSection({ platforms = [] }: EcosystemBuildingProps) {
  const [activePlatformModal, setActivePlatformModal] = useState<PlatformCardData | null>(null);

  return (
    <section id="what-we-build" className="py-20 sm:py-24 bg-white text-slate-900 relative overflow-hidden border-b border-slate-200/70">
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-xs font-semibold text-cyan-800 backdrop-blur-md mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
            The YEH Ecosystem
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-6"
          >
            What We Are Building
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal"
          >
            We are progressively designing an interconnected ecosystem where young minds can learn, compete, collaborate, and discover genuine opportunities beyond traditional academic boundaries.
          </motion.p>
        </div>

        {/* 5 Core Ecosystem Pillars with Status Badges */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {ecosystemPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="rounded-3xl bg-slate-50/80 border border-slate-200/90 p-6 sm:p-7 hover:border-blue-300 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide border ${pillar.statusColor}`}>
                      {pillar.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-6">
                    {pillar.description}
                  </p>
                </div>

                <Link
                  href={pillar.link}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors pt-4 border-t border-slate-200/60"
                >
                  <span>{pillar.linkText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Live Digital Platforms Spotlight from Database */}
        {platforms.length > 0 && (
          <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0F172A] border border-slate-800 p-6 sm:p-10 shadow-2xl text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live Digital Platforms
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Explore Integrated Portals
                </h3>
              </div>
              <Link
                href="/platforms"
                className="text-xs sm:text-sm font-bold text-slate-300 hover:text-white inline-flex items-center gap-1.5 transition-colors"
              >
                <span>View all portals</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  className="p-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-blue-400/50 hover:bg-white/[0.08] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-400/30">
                        {platform.category || 'Platform'}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        {platform.status === 'live' ? 'Live' : 'Active'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-1.5">
                      {platform.name}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-normal mb-4 line-clamp-2">
                      {platform.description || 'Integrated digital platform under Youth Empowerment Hub.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setActivePlatformModal(platform)}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {platform.url && (
                      <a
                        href={platform.url}
                        target={platform.url.startsWith('http') ? '_blank' : '_self'}
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                        aria-label={`Open ${platform.name}`}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <PlatformIntroModal
        platform={activePlatformModal}
        isOpen={Boolean(activePlatformModal)}
        onClose={() => setActivePlatformModal(null)}
      />
    </section>
  );
}
