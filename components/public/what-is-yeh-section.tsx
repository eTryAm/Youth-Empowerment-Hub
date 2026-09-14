'use client';

import { motion } from 'framer-motion';
import { BookOpen, Trophy, Sparkles, Users2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const approachCards = [
  {
    step: '01',
    title: 'LEARN',
    tagline: 'Practical & Personal Skills',
    description: 'Develop hands-on capabilities in technology, communication, design, and problem solving through peer-led sessions.',
    icon: BookOpen,
    accent: 'from-blue-500/20 to-blue-600/5 text-blue-400 border-blue-500/20',
  },
  {
    step: '02',
    title: 'PARTICIPATE',
    tagline: 'Events & Challenges',
    description: 'Take part in quizzes, workshops, debates, sports tournaments, and collaborative challenges organized for students.',
    icon: Trophy,
    accent: 'from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/20',
  },
  {
    step: '03',
    title: 'SHOWCASE',
    tagline: 'Demonstrate Abilities',
    description: 'Get visible opportunities to exhibit your creative projects, leadership efforts, and talents to peers and mentors.',
    icon: Sparkles,
    accent: 'from-violet-500/20 to-violet-600/5 text-violet-400 border-violet-500/20',
  },
  {
    step: '04',
    title: 'CONNECT',
    tagline: 'Meaningful Peer Network',
    description: 'Build valuable relationships with fellow ambitious students, campus ambassadors, and future collaborators.',
    icon: Users2,
    accent: 'from-orange-500/20 to-orange-600/5 text-orange-400 border-orange-500/20',
  },
];

export function WhatIsYehSection() {
  return (
    <section id="about-initiative" className="py-20 sm:py-28 bg-[#0A0F1C] text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 -left-48 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-300 backdrop-blur-md mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Independent Student Initiative
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6"
          >
            What is Youth Empowerment Hub?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4 text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal"
          >
            <p>
              <strong className="text-white font-semibold">Youth Empowerment Hub</strong> is an independent student-led initiative focused on creating meaningful avenues for students and young people to learn, participate, showcase their abilities, explore opportunities, and contribute to a growing community.
            </p>
            <p className="text-slate-400 text-xs sm:text-sm md:text-base">
              YEH is being developed progressively through real activities, student participation, and genuine community collaboration — built by students who understand what young learners actually need today.
            </p>
          </motion.div>
        </div>

        {/* Our Approach Card Group */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 block">
                How We Operate
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Our Four-Pillar Approach
              </h3>
            </div>
            <Link
              href="/about"
              className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors group"
            >
              <span>Learn more about us</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {approachCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="group relative rounded-3xl bg-white/[0.03] border border-white/10 p-6 sm:p-7 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.accent} flex items-center justify-center border group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black text-slate-500 tracking-wider">
                        {card.step}
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-white tracking-wide mb-1">
                      {card.title}
                    </h4>
                    <div className="text-xs font-semibold text-slate-400 mb-3">
                      {card.tagline}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs font-semibold text-slate-400 group-hover:text-blue-400 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>Student-driven execution</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
