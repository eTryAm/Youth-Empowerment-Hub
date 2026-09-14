'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Flag, Target, Compass, Check } from 'lucide-react';

const statusBreakdown = [
  {
    phase: 'CURRENT STAGE',
    title: 'Independent Student-Led Initiative',
    description: 'Operating as a self-organized, student-driven platform focused on practical youth development, activities, and skills.',
    badge: 'Active & Operational',
    badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    icon: Flag,
    current: true,
  },
  {
    phase: 'CORE FOCUS',
    title: 'Skills, Opportunities & Community',
    description: 'Curating student learning tracks, workshops, quizzes, tournaments, and meaningful collaboration across campuses.',
    badge: 'Ongoing Mission',
    badgeColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    icon: Target,
    current: false,
  },
  {
    phase: 'NEXT PHASE',
    title: 'Formal Organizational Structure',
    description: 'Formal registration will be pursued as activities expand and institutional scale demands, following our progressive roadmap.',
    badge: 'Future Roadmap',
    badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    icon: Compass,
    current: false,
  },
];

export function TransparencyStatusSection() {
  return (
    <section id="transparency" className="py-20 sm:py-28 bg-[#070B14] text-white relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />

      <div className="container-custom relative z-10 max-w-5xl">
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 backdrop-blur-md mb-4"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Our Transparency Commitment
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6"
          >
            Where We Are Today
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4 text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal"
          >
            <p>
              Youth Empowerment Hub is currently an <strong className="text-white font-semibold">independent student-led initiative</strong>. We are building our activities, community, and platform progressively through student participation and collaboration.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm md:text-base">
              Transparency matters to us. We believe students and collaborators should know who they are engaging with and exactly what stage the initiative is currently in.
            </p>
          </motion.div>
        </div>

        {/* 3-Card Stage Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12">
          {statusBreakdown.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.phase}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className={`rounded-3xl p-6 sm:p-7 transition-all duration-300 relative flex flex-col justify-between ${
                  item.current
                    ? 'bg-gradient-to-b from-blue-950/40 via-white/[0.04] to-white/[0.02] border-2 border-blue-500/40 shadow-xl shadow-blue-500/10'
                    : 'bg-white/[0.02] border border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                      {item.phase}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight leading-tight">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal mt-3">
                    {item.description}
                  </p>
                </div>

                {item.current && (
                  <div className="mt-6 pt-4 border-t border-blue-500/20 flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <Check className="w-4 h-4" />
                    <span>Operating today with full transparency</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Clear Legal Status Note */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 sm:p-6 text-center">
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
            <strong className="text-white">Future Legal Structure:</strong> Formal organizational registration is part of our future roadmap and will be pursued when appropriate as the initiative develops in scale, activities, and operational scope.
          </p>
        </div>
      </div>
    </section>
  );
}
