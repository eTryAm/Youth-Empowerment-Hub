'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, CircleDashed } from 'lucide-react';

const futureItems = [
  "Opportunities Platform",
  "Donation Platform",
  "Scholarships",
  "Digital Learning",
  "Training Centers",
  "Libraries",
  "Advanced Mentorship Programs",
  "Startup Ecosystem",
  "Global Youth Communities",
  "District-Level Initiatives"
];

export function FutureVisionSection() {
  return (
    <section className="py-24 bg-[#0A0F1C] text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/30 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />
      
      <div className="container-custom relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide uppercase mb-4 border border-blue-400/30 bg-blue-500/10 text-blue-300 backdrop-blur-md">
            The Roadmap & Ecosystem
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-white">Building the Digital Ecosystem</h2>
          <p className="mt-4 text-slate-300 max-w-2xl text-lg">
            Our unified hub connects young minds to live platforms, opportunities, and future-ready initiatives across education, technology, and sports.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 relative">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40 text-emerald-400 font-bold">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-white">Live & Integrated Platforms</h3>
            </div>
            
            <div className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
              <ul className="space-y-5">
                {[
                  "Opportunities Portal (Central Gateway for Careers, Internships & Jobs)",
                  "BrainStorm (Digital Learning & Knowledge Hub)",
                  "CricketLive (Live Sports & Athletics Engagement)",
                  "Youth Initiatives & Events Board",
                  "Central Admin Portal (Dynamic Ecosystem Manager)",
                ].map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-200 text-base font-medium leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/40 text-amber-400 font-bold">
                →
              </div>
              <h3 className="text-2xl font-bold text-white">Upcoming Expansions</h3>
            </div>

            <div className="bg-[#111827]/90 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden">
              <ul className="space-y-4">
                {futureItems.map((item, i) => (
                  <motion.li 
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    viewport={{ once: true }}
                    className="flex items-start gap-4 group"
                  >
                    <CircleDashed className="w-5 h-5 text-amber-400/80 shrink-0 mt-0.5 group-hover:text-amber-300 transition-colors" />
                    <span className="text-slate-300 group-hover:text-white transition-colors text-base font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}