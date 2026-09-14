'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  HeartHandshake, 
  Trophy, 
  Compass, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlatformIntroModal } from '@/components/public/platform-intro-modal';
import type { PlatformCardData } from '@/components/public/platform-card';

const OPPORTUNITY_TRACKS = [
  {
    title: 'Campus Ambassador Program',
    badge: 'Popular Leadership Track',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
    icon: GraduationCap,
    description: 'Lead your college or university chapter, organize peer workshops, tech hackathons, and represent YEH on your campus.',
    highlights: ['Host campus info sessions & student meetups', 'Exclusive leadership kit & verifiable LORs'],
  },
  {
    title: 'Student Volunteering',
    badge: 'Active Teams',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
    icon: HeartHandshake,
    description: 'Contribute behind the scenes across technology, web development, content creation, social media, and event logistics.',
    highlights: ['Flexible 2–4 hours weekly commitment', 'Hands-on project experience in agile teams'],
  },
  {
    title: 'Competitions & Hackathons',
    badge: 'Open Challenges',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200/80',
    icon: Trophy,
    description: 'Participate in student innovation challenges, coding hackathons, talent hunts, and youth athletic tournaments.',
    highlights: ['Showcase your skills & win community awards', 'Peer feedback & mentor guidance'],
  },
  {
    title: 'Skill Fellowships & Roles',
    badge: 'Growth Track',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    icon: Compass,
    description: 'Access curated student fellowships, research projects, and regional youth representative opportunities across India.',
    highlights: ['Certificate of completion & experiential learning', '100% free for all students'],
  },
];

interface ParticipationRolesSectionProps {
  platforms?: PlatformCardData[];
}

export function ParticipationRolesSection({ platforms = [] }: ParticipationRolesSectionProps) {
  const [activeModalPlatform, setActiveModalPlatform] = useState<PlatformCardData | null>(null);

  const opportunitiesPlatform =
    platforms.find(
      (p) => p.slug === 'opportunities' || p.name.toLowerCase().includes('opportunities')
    ) || {
      id: 'opportunities-default',
      name: 'Opportunities Portal',
      slug: 'opportunities',
      category: 'Careers & Opportunities',
      status: 'live',
      url: '/platforms',
      description: 'Our official platform for verified internship listings, campus ambassador applications, and youth career opportunities.',
    };

  const handleOpenOpportunities = () => {
    setActiveModalPlatform(opportunitiesPlatform);
  };

  return (
    <section id="opportunities" className="py-20 sm:py-24 bg-white text-slate-900 relative overflow-hidden border-t border-slate-200/70">
      <div className="container-custom relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-700 backdrop-blur-md mb-4 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Central Opportunities Gateway
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-5"
          >
            Explore & Grab Opportunities
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal"
          >
            Looking to join as a <strong>Campus Ambassador</strong>, volunteer behind the scenes, or participate in student challenges? We have already centralized all open student roles, leadership tracks, and applications directly on our <strong>Opportunities Portal</strong>.
          </motion.p>
        </div>

        {/* Central Soothing Callout Card */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-50/90 via-blue-50/30 to-indigo-50/20 border border-slate-200/80 p-6 sm:p-10 md:p-12 shadow-sm relative overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {OPPORTUNITY_TRACKS.map((track, idx) => {
              const Icon = track.icon;
              return (
                <motion.div
                  key={track.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className="rounded-2xl bg-white border border-slate-200/70 p-5 sm:p-6 shadow-xs hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200/70 text-blue-600 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${track.badgeColor}`}>
                        {track.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
                      {track.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                      {track.description}
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    {track.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              onClick={handleOpenOpportunities}
              size="lg"
              className="w-full sm:w-auto h-12 sm:h-13 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-500/20 border-0 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              <span>Explore Opportunities Portal</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 sm:h-13 px-6 rounded-2xl border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm sm:text-base shadow-xs"
            >
              <Link href="/platforms" className="flex items-center justify-center gap-2">
                <span>View All Ecosystem Platforms</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Trust Footnote */}
          <div className="mt-8 pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              100% Free & Open to All Students
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              Direct Application Tracking
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              Verified Experiential Learning
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Platform Preview Modal */}
      <PlatformIntroModal
        platform={activeModalPlatform}
        isOpen={Boolean(activeModalPlatform)}
        onClose={() => setActiveModalPlatform(null)}
      />
    </section>
  );
}
