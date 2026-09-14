'use client';

import { motion } from 'framer-motion';
import { Info, CheckSquare, CalendarCheck, MessageSquare, HeartHandshake, Shield } from 'lucide-react';

const trustPrinciples = [
  {
    title: 'Clear Information',
    description: 'Students should always understand what an event, workshop, or ambassador role involves before signing up. No hidden requirements.',
    icon: Info,
    color: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    title: 'Transparent Roles',
    description: 'Every contributor role, ambassador responsibility, and team expectation is communicated honestly and upfront.',
    icon: CheckSquare,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  },
  {
    title: 'Verifiable Activities',
    description: 'All quizzes, competitions, workshops, and sports meets have identifiable coordinators, dates, guidelines, and real results.',
    icon: CalendarCheck,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
  {
    title: 'Responsible Communication',
    description: 'Zero misleading claims about formal government recognition, NGO status, accredited diplomas, or commercial placement guarantees.',
    icon: MessageSquare,
    color: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    title: 'Student-First Approach',
    description: 'Every initiative is built with one central mission: youth welfare, skill enhancement, confidence building, and genuine peer empowerment.',
    icon: HeartHandshake,
    color: 'text-rose-600 bg-rose-50 border-rose-200',
  },
];

export function AccountabilitySection() {
  return (
    <section id="accountability" className="py-20 sm:py-24 bg-slate-50/70 text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      <div className="container-custom relative z-10 max-w-6xl">
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 backdrop-blur-md mb-4"
          >
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            Integrity First
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-6"
          >
            Trust & Accountability
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal"
          >
            Because we are an independent student initiative, trust is earned through complete honesty, responsible communication, and real activities — not through false claims or inflated labels.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {trustPrinciples.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className={`rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-300 p-6 sm:p-7 ${
                  idx === trustPrinciples.length - 1 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-4 ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
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
