'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  GraduationCap, 
  Cpu, 
  Users, 
  Building2 
} from 'lucide-react';
import { DonationModal } from '@/components/public/donation-modal';

interface DonationCtaProps {
  donationEnabled: boolean;
  donationUrl?: string;
}

const IMPACT_TIERS = [
  {
    amount: '₹500',
    title: 'Student Starter Kit',
    description: 'Supplies 1 young student with foundational coding curriculum resources and hands-on maker components.',
    icon: GraduationCap,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    amount: '₹2,500',
    title: 'Hackathon Seat',
    description: 'Sponsors 1 student team with compute credits, prototype hardware, and 1-on-1 industry mentorship.',
    icon: Cpu,
    color: 'from-orange-500 to-amber-500',
    popular: true,
  },
  {
    amount: '₹5,000',
    title: 'Career Fellowship',
    description: 'Covers a 3-month skill fellowship, portfolio review, and placement gateway access for an underserved youth.',
    icon: Sparkles,
    color: 'from-emerald-500 to-teal-500',
  },
  {
    amount: '₹15,000',
    title: 'Community Tech Pod',
    description: 'Sets up a localized digital learning station with refurbished devices for rural learners.',
    icon: Users,
    color: 'from-violet-500 to-purple-500',
  },
];

export function DonationCta({ donationEnabled, donationUrl }: DonationCtaProps) {
  const [selectedTier, setSelectedTier] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!donationEnabled) {
    return null;
  }

  const handleDonateClick = () => {
    if (donationUrl && donationUrl.startsWith('http')) {
      window.open(donationUrl, '_blank', 'noopener,noreferrer');
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <section className="py-16 sm:py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-[#0A0F1C] via-[#0D1527] to-[#0A0F1C] text-white">
      {/* Background Decorative Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] bg-gradient-to-r from-orange-600/15 via-rose-600/15 to-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />

      <div className="container px-4 md:px-6 mx-auto relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-500/15 to-rose-500/15 border border-orange-400/30 text-orange-400 text-xs font-black uppercase tracking-wider shadow-sm">
            <Heart className="w-3.5 h-3.5 fill-orange-400 text-orange-400 animate-pulse" />
            Invest in Young Innovators • Spark Real Change
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            One Opportunity Can Change a Generation.
          </h2>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal">
            Talent is everywhere, but opportunities are not. Your contribution directly funds youth hackathons, robotics innovation kits, coding bootcamps, and career fellowships for ambitious students from underserved backgrounds.
          </p>
        </div>

        {/* Psychological Micro-Impact Tier Selector (Clean Rupees Only) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10 sm:mb-12">
          {IMPACT_TIERS.map((tier, idx) => {
            const isSelected = selectedTier === idx;
            const Icon = tier.icon;

            return (
              <motion.div
                key={tier.title}
                whileHover={{ y: -4 }}
                onClick={() => setSelectedTier(idx)}
                className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between border ${
                  isSelected
                    ? 'bg-white/[0.08] border-orange-400/80 shadow-2xl shadow-orange-500/15 ring-2 ring-orange-400/30'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-[10px] font-black uppercase tracking-wider text-white shadow-md">
                    Most Chosen Impact
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${tier.color} p-2 text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl md:text-3xl font-black text-white">{tier.amount}</span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">{tier.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{tier.description}</p>
                </div>

                <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className={`font-bold ${isSelected ? 'text-orange-400' : 'text-slate-500'}`}>
                    {isSelected ? '✓ Selected' : 'Tap to Select'}
                  </span>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-orange-400 bg-orange-500 text-white' : 'border-white/20'
                  }`}>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Central Moving / Pulsing Donation Action Card */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-orange-950/40 border border-white/15 p-6 sm:p-10 md:p-12 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -left-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6 relative z-10">
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug">
              Ready to fuel {IMPACT_TIERS[selectedTier].amount} for the {IMPACT_TIERS[selectedTier].title}?
            </h3>
            
            <p className="text-xs sm:text-sm md:text-base text-slate-300">
              100% of your pledge directly purchases workshop hardware, funds hackathon scholarships, and builds educational infrastructure with complete financial transparency.
            </p>

            {/* Pulsing Eye-Catching Moving Donation Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button
                onClick={handleDonateClick}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(249, 115, 22, 0.4)',
                    '0 0 0 12px rgba(249, 115, 22, 0)',
                    '0 0 0 0 rgba(249, 115, 22, 0.4)',
                  ],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative inline-flex items-center justify-center gap-2 sm:gap-3 px-5 sm:px-8 md:px-10 py-3.5 sm:py-4.5 rounded-full bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#E11D48] text-white font-black text-sm sm:text-base md:text-lg shadow-2xl shadow-orange-500/30 cursor-pointer overflow-hidden group w-full sm:w-auto"
              >
                {/* Moving light beam reflection */}
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
                
                <Heart className="w-5 h-5 fill-white text-white shrink-0 group-hover:scale-110 transition-transform" />
                <span>Pledge Support & Donate {IMPACT_TIERS[selectedTier].amount}</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            {/* Trust Markers */}
            <div className="pt-3 sm:pt-4 flex items-center justify-center flex-wrap gap-3 sm:gap-6 text-[11px] sm:text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                100% Program Allocation
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-cyan-400" />
                Secure Encrypted Transactions
              </span>
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-400" />
                NGO & Institutional Backing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Integration Modal Dialog */}
      <DonationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedAmount={IMPACT_TIERS[selectedTier].amount}
        selectedTitle={IMPACT_TIERS[selectedTier].title}
        selectedDescription={IMPACT_TIERS[selectedTier].description}
      />
    </section>
  );
}