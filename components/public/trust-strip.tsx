'use client';

import { motion } from 'framer-motion';
import { GraduationCap, ShieldCheck, Compass, Users, TrendingUp } from 'lucide-react';

const trustItems = [
  {
    title: 'Student-Led',
    description: 'Built, organized & driven by active students',
    icon: GraduationCap,
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    title: 'Independent',
    description: 'Self-governed youth initiative for real student needs',
    icon: ShieldCheck,
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    title: 'Opportunity-Focused',
    description: 'Curating practical learning, contests & early roles',
    icon: Compass,
    color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  },
  {
    title: 'Community Driven',
    description: 'Expanding through peer participation & collaboration',
    icon: Users,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    title: 'Transparent Growth',
    description: 'Open progressive roadmap & verifiable milestones',
    icon: TrendingUp,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
];

export function TrustStrip() {
  return (
    <section className="relative z-20 -mt-6 sm:-mt-8 px-4 w-full">
      <div className="container-custom max-w-6xl">
        <div className="rounded-3xl border border-white/10 bg-[#0F172A]/90 p-4 sm:p-6 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className={`flex flex-col items-center text-center p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all duration-300 ${
                    index === trustItems.length - 1 ? 'col-span-2 md:col-span-1' : ''
                  }`}
                >
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border mb-2.5 ${item.color}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white mb-1 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed font-normal line-clamp-2">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
