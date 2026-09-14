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
    accent: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    step: '02',
    title: 'PARTICIPATE',
    tagline: 'Events & Challenges',
    description: 'Take part in quizzes, workshops, debates, sports tournaments, and collaborative challenges organized for students.',
    icon: Trophy,
    accent: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  },
  {
    step: '03',
    title: 'SHOWCASE',
    tagline: 'Demonstrate Abilities',
    description: 'Get visible opportunities to exhibit your creative projects, leadership efforts, and talents to peers and mentors.',
    icon: Sparkles,
    accent: 'bg-violet-50 text-violet-600 border-violet-200',
  },
  {
    step: '04',
    title: 'CONNECT',
    tagline: 'Meaningful Peer Network',
    description: 'Build valuable relationships with fellow ambitious students, campus ambassadors, and future collaborators.',
    icon: Users2,
    accent: 'bg-orange-50 text-orange-600 border-orange-200',
  },
];

export function WhatIsYehSection() {
  return (
    <section id="about-initiative" className="py-20 sm:py-24 bg-white text-slate-900 relative overflow-hidden border-b border-slate-200/70">
      <div className="container-custom relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 backdrop-blur-md mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Independent Student Initiative
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-6"
          >
            What is Youth Empowerment Hub?
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4 text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal"
          >
            <p>
              <strong className="text-slate-900 font-semibold">Youth Empowerment Hub</strong> is an independent student-led initiative focused on creating meaningful avenues for students and young people to learn, participate, showcase their abilities, explore opportunities, and contribute to a growing community.
            </p>
            <p className="text-slate-500 text-xs sm:text-sm md:text-base">
              YEH is being developed progressively through real activities, student participation, and genuine community collaboration — built by students who understand what young learners actually need today.
            </p>
          </motion.div>
        </div>

        {/* Our Approach Card Group */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 block">
                How We Operate
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                Our Four-Pillar Approach
              </h3>
            </div>
            <Link
              href="/about"
              className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors group"
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
                  className="group relative rounded-3xl bg-slate-50/80 border border-slate-200/80 p-6 sm:p-7 hover:border-blue-300 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-12 h-12 rounded-2xl ${card.accent} flex items-center justify-center border group-hover:scale-105 transition-transform`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black text-slate-400 tracking-wider">
                        {card.step}
                      </span>
                    </div>

                    <h4 className="text-lg font-black text-slate-900 tracking-wide mb-1">
                      {card.title}
                    </h4>
                    <div className="text-xs font-semibold text-slate-500 mb-3">
                      {card.tagline}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
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
