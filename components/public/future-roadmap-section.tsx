'use client';

import { motion } from 'framer-motion';
import { Compass, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

const roadmapPhases = [
  {
    step: 'Phase 01',
    period: 'TODAY',
    status: 'In Progress',
    statusColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    title: 'Student Activities & Foundation',
    items: [
      'Campus Ambassador network onboarding',
      'Student quizzes, debates & skill workshops',
      'Digital platforms foundation (Opportunities, BrainStorm, CricketLive)',
      'Community building across local colleges',
    ],
  },
  {
    step: 'Phase 02',
    period: 'NEXT',
    status: 'Upcoming',
    statusColor: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    title: 'Expanded Opportunities & Projects',
    items: [
      'Peer-to-peer technical & creative mentorship tracks',
      'Curated student project collaborations',
      'Skill challenge series & hackathon events',
      'Enhanced platform integrations for career resources',
    ],
  },
  {
    step: 'Phase 03',
    period: 'GROWTH',
    status: 'Planned',
    statusColor: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    title: 'Regional Student Chapters',
    items: [
      'District and state-level student coordination roles',
      'Inter-college innovation challenges & sports meets',
      'Digital record keeping for participant credentials',
      'Student-led advisory council formation',
    ],
  },
  {
    step: 'Phase 04',
    period: 'FUTURE',
    status: 'Roadmap',
    statusColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    title: 'Formal Organizational Structure',
    items: [
      'Formal legal registration as an appropriate entity',
      'Institutional & academic collaborative programs',
      'Expanded welfare and learning initiatives across states',
      'Sustainable youth leadership ecosystem',
    ],
  },
];

export function FutureRoadmapSection() {
  return (
    <section id="roadmap" className="py-20 sm:py-28 bg-[#0A0F1C] text-white relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300 backdrop-blur-md mb-4"
          >
            <Compass className="w-3.5 h-3.5" />
            Progressive Vision
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6"
          >
            Where We&apos;re Going
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal"
          >
            We believe in progressive, verifiable development rather than exaggerated claims. Here is our grounded roadmap as the initiative evolves step-by-step through real student participation.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {roadmapPhases.map((phase, idx) => (
            <motion.div
              key={phase.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="rounded-3xl bg-white/[0.03] border border-white/10 p-6 sm:p-7 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black tracking-widest text-slate-400 uppercase">
                    {phase.step}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${phase.statusColor}`}>
                    {phase.period}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-4 tracking-tight">
                  {phase.title}
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-slate-300 leading-relaxed font-normal">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{phase.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
