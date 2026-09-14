'use client';

import { motion } from 'framer-motion';
import { Compass, CheckCircle2, Clock } from 'lucide-react';

const roadmapPhases = [
  {
    step: 'Phase 01',
    period: 'TODAY',
    status: 'In Progress',
    statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
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
    statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
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
    statusColor: 'bg-violet-50 text-violet-700 border-violet-200',
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
    statusColor: 'bg-amber-50 text-amber-700 border-amber-200',
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
    <section id="roadmap" className="py-20 sm:py-24 bg-white text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-semibold text-violet-700 backdrop-blur-md mb-4"
          >
            <Compass className="w-3.5 h-3.5 text-violet-600" />
            Progressive Vision
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-6"
          >
            Where We&apos;re Going
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal"
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
              className="rounded-3xl bg-slate-50/70 border border-slate-200/90 p-6 sm:p-7 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col justify-between"
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

                <h3 className="text-lg font-bold text-slate-900 mb-4 tracking-tight">
                  {phase.title}
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm">
                  {phase.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-slate-600 leading-relaxed font-normal">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
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
