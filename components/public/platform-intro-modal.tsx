'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ExternalLink, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Briefcase,
  GraduationCap,
  Award,
  Zap,
  BookOpen,
  Trophy,
  Rocket,
  Clock,
  ArrowLeft,
  MapPin,
  Users,
  Gift,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { PlatformCardData } from '@/components/public/platform-card';

interface PlatformIntroModalProps {
  platform: PlatformCardData | null;
  isOpen: boolean;
  onClose: () => void;
}

// Tailored feature sets for known platforms, with a smart fallback for custom dynamic platforms
function getPlatformFeatures(platform: PlatformCardData) {
  const name = platform.name.toLowerCase();
  const slug = (platform.slug || '').toLowerCase();
  const category = (platform.category || '').toLowerCase();

  // 1. Opportunities & Leadership Portal
  if (name.includes('opportunit') || slug.includes('opportunit') || category.includes('career') || category.includes('leader')) {
    return [
      {
        icon: GraduationCap,
        title: 'Want to Become Campus Ambassador?',
        desc: 'Lead your college or university chapter, organize tech hackathons, clubs, and student networking.',
      },
      {
        icon: MapPin,
        title: 'Represent Your State & District',
        desc: 'Official regional youth representative coordinating local summits, talent discovery, and grassroots initiatives.',
      },
      {
        icon: Users,
        title: 'Volunteer in Events & Flagship Summits',
        desc: 'Hands-on stage management, VIP delegate coordination, keynote logistics, and media operations.',
      },
      {
        icon: Trophy,
        title: 'Organising Sports & Tournaments',
        desc: 'Lead youth cricket leagues, athletic meetups, fitness marathons, and tournament management.',
      },
      {
        icon: Globe,
        title: 'Want to Be Part of the Community?',
        desc: 'Connect, collaborate, and build with thousands of student developers, creators, and leaders across India.',
      },
      {
        icon: Gift,
        title: 'Exciting Rewards, Goodies & LORs',
        desc: 'Official swag kits (T-Shirts, Hoodies, Badges), verified Certificates of Leadership, official LORs, and stipends.',
      },
    ];
  }

  // 2. BrainStorm Platform
  if (name.includes('brain') || slug.includes('brain') || category.includes('tech') || category.includes('education')) {
    return [
      {
        icon: BookOpen,
        title: 'Interactive Learning & Skill Labs',
        desc: 'Hands-on coding modules, modern tech tracks, and practical problem solving.',
      },
      {
        icon: Zap,
        title: 'Hackathons & Technical Sprints',
        desc: 'Participate in student innovation sprints and win community recognition.',
      },
      {
        icon: Award,
        title: 'Project Showcases & Peer Reviews',
        desc: 'Build real-world projects and receive feedback from engineering mentors.',
      },
      {
        icon: Globe,
        title: 'Digital Certifications & Badges',
        desc: 'Earn verifiable credentials upon completing practical technical tracks.',
      },
    ];
  }

  // 3. CricketLive Platform
  if (name.includes('cricket') || slug.includes('cricket') || category.includes('sport')) {
    return [
      {
        icon: Trophy,
        title: 'Live Ball-by-Ball Cricket Scores',
        desc: 'Real-time updates, match commentary, player stats, scorecards, and highlights.',
      },
      {
        icon: Zap,
        title: 'Youth Tournament & League Management',
        desc: 'Team registrations, tournament fixtures, live point tables, and standings.',
      },
      {
        icon: Award,
        title: 'Athletic Skill Clinics & Fitness Camps',
        desc: 'Youth athletic development, coaching clinics, fitness regimens, and sportsmanship.',
      },
      {
        icon: Globe,
        title: 'Tournament Accreditations & Gear',
        desc: 'Official organizer kits, referee credentials, and sports equipment sponsorship.',
      },
    ];
  }

  // Dynamic fallback for custom platforms
  return [
    {
      icon: Sparkles,
      title: 'Dedicated Digital Ecosystem Portal',
      desc: platform.description || 'Full suite of features, tools, and resources for our community.',
    },
    {
      icon: Zap,
      title: 'Live Interactive Tools & Services',
      desc: 'Seamless user experience designed specifically for youth empowerment.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified & Secure Gateway',
      desc: 'Official platform supported and maintained by the central organization.',
    },
    {
      icon: Globe,
      title: 'Real-Time Updates & Support',
      desc: 'Continuous enhancements and dedicated user support channels.',
    },
  ];
}

export function PlatformIntroModal({ platform, isOpen, onClose }: PlatformIntroModalProps) {
  const router = useRouter();
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowComingSoon(false);
    }
  }, [isOpen]);

  if (!isOpen || !platform) return null;

  const features = getPlatformFeatures(platform);
  const status = platform.status ?? 'live';
  const rawUrl = platform.url?.trim() || '';
  const isInternalUrl = rawUrl.startsWith('/') || rawUrl === '/opportunities';
  const hasValidExternalUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://');

  const handleLaunch = () => {
    if (isInternalUrl) {
      onClose();
      router.push(rawUrl);
    } else if (hasValidExternalUrl) {
      window.open(rawUrl, '_blank', 'noopener,noreferrer');
    } else {
      setShowComingSoon(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex min-h-full items-start sm:items-center justify-center p-3 sm:p-6 py-6 sm:py-10">
        {/* Backdrop Click */}
        <div className="fixed inset-0 pointer-events-auto" onClick={onClose} />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-200 my-auto max-h-[88vh] flex flex-col pointer-events-auto"
        >
          {showComingSoon ? (
            /* ========================================================
               COMING SOON DIALOG
               ======================================================== */
            <div className="p-6 sm:p-10 text-center flex flex-col items-center space-y-5 overflow-y-auto">
              <div className="relative">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                  <Rocket className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-slate-900 shadow">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>

              <div className="space-y-2 max-w-md">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Platform In Active Preparation
                </div>
                <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {platform.name} Launching Soon
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  The live portal link and digital systems for <strong>{platform.name}</strong> are currently being finalized. Once deployed, the direct site link will open automatically from this gateway.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 w-full justify-center">
                <Button
                  onClick={() => setShowComingSoon(false)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-11 px-6 rounded-2xl shadow-md text-xs sm:text-sm cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Platform Overview
                </Button>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="border-slate-200 text-slate-700 h-11 px-6 rounded-2xl font-semibold text-xs sm:text-sm cursor-pointer"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            /* ========================================================
               PLATFORM INTRO & OVERVIEW VIEW
               ======================================================== */
            <>
              {/* Header Banner (Always Visible at Top) */}
              <div
                className="p-5 sm:p-7 text-white relative overflow-hidden shrink-0"
                style={{
                  background: platform.accentColor
                    ? `linear-gradient(135deg, ${platform.accentColor} 0%, #0A0F1C 100%)`
                    : 'linear-gradient(135deg, #1E3A8A 0%, #0A0F1C 100%)',
                }}
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-start justify-between gap-3 relative z-10">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center flex-wrap gap-1.5">
                      {platform.category && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 text-white backdrop-blur-md">
                          {platform.category}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                        status === 'live'
                          ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40'
                          : 'bg-amber-500/30 text-amber-300 border border-amber-400/40'
                      }`}>
                        {status === 'live' ? '🟢 Live Platform' : `🟡 ${status.replace('_', ' ')}`}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                      {platform.name}
                    </h2>
                  </div>

                  <button
                    onClick={onClose}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                <p className="mt-2 text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl relative z-10 line-clamp-2 sm:line-clamp-none">
                  {platform.description ||
                    platform.longDescription ||
                    'Access features, services, applications, and opportunities directly on this platform.'}
                </p>
              </div>

              {/* Scrollable Body: Features & Actions */}
              <div className="p-5 sm:p-7 space-y-5 bg-white overflow-y-auto flex-1">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Key Capabilities & Services:
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {features.map((feature, idx) => {
                      const Icon = feature.icon;
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 hover:bg-blue-50/50 hover:border-blue-100 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold mt-0.5">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                              {feature.title}
                            </div>
                            <div className="text-[11px] sm:text-xs text-slate-500 leading-relaxed mt-0.5">
                              {feature.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Launch Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <Button
                    onClick={handleLaunch}
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-7 h-11 sm:h-12 rounded-2xl shadow-lg shadow-blue-500/20 text-xs sm:text-sm transition-all hover:scale-[1.02] border-0 cursor-pointer"
                  >
                    <span>{isInternalUrl ? 'Open Opportunities Portal' : 'Go to Site'}</span>
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>

                  <Button
                    onClick={onClose}
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto rounded-2xl h-11 sm:h-12 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm cursor-pointer"
                  >
                    Back to Gateway
                  </Button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}