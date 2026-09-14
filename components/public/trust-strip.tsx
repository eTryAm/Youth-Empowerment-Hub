'use client';

import { motion } from 'framer-motion';
import { GraduationCap, ShieldCheck, Compass, Users, TrendingUp } from 'lucide-react';

const trustItems = [
  {
    title: 'Student-Led',
    description: 'Built, organized & driven by active students',
    icon: GraduationCap,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    title: 'Independent',
    description: 'Self-governed youth initiative for real student needs',
    icon: ShieldCheck,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  },
  {
    title: 'Opportunity-Focused',
    description: 'Curating practical learning, contests & early roles',
    icon: Compass,
    color: 'text-violet-600 bg-violet-50 border-violet-200',
  },
  {
    title: 'Community Driven',
    description: 'Expanding through peer participation & collaboration',
    icon: Users,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    title: 'Transparent Growth',
    description: 'Open progressive roadmap & verifiable milestones',
    icon: TrendingUp,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
];

export function TrustStrip() {
  return (
    <section className="relative z-20 py-8 sm:py-10 px-4 w-full bg-slate-50/70 border-b border-slate-200/80">
      <div className="container-custom max-w-6xl">
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
                className={`flex flex-col items-center text-center p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all duration-300 ${
                  index === trustItems.length - 1 ? 'col-span-2 md:col-span-1' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center border mb-2.5 ${item.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal line-clamp-2">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
