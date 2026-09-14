'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Briefcase, Zap, HeartHandshake } from 'lucide-react';

const needCards = [
  {
    title: 'Practical Skills',
    problem: 'Classroom syllabi often lack hands-on experience in modern technology, public speaking, and problem solving.',
    solution: 'We organize interactive workshops, peer coding labs, and communication sessions to build tangible, functional capabilities.',
    icon: Lightbulb,
    badgeColor: 'text-blue-600 bg-blue-50 border-blue-200',
  },
  {
    title: 'Real Opportunities',
    problem: 'Students frequently miss out on early internships, project collaborations, and challenges due to fragmented information.',
    solution: 'We curate open student opportunities, technical challenges, and community roles in one clear, easily accessible space.',
    icon: Briefcase,
    badgeColor: 'text-cyan-600 bg-cyan-50 border-cyan-200',
  },
  {
    title: 'Self-Confidence',
    problem: 'Hesitation, fear of public speaking, and lack of stage exposure often hold talented young minds back.',
    solution: 'We provide low-pressure, supportive stages where students can lead teams, organize events, and voice their creative ideas.',
    icon: Zap,
    badgeColor: 'text-amber-600 bg-amber-50 border-amber-200',
  },
  {
    title: 'Peer Community',
    problem: 'Studying in silos without a vibrant network of driven peers limits personal and professional growth.',
    solution: 'We bring together passionate learners, campus ambassadors, and volunteers across diverse colleges to collaborate and grow.',
    icon: HeartHandshake,
    badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  },
];

export function WhyStartedSection() {
  return (
    <section className="py-20 sm:py-24 bg-[#F8FAFC] text-slate-900 relative overflow-hidden border-b border-slate-200/70">
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-semibold text-amber-800 backdrop-blur-md mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Our Motivation
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-6"
          >
            Why We Started
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4 text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal"
          >
            <p>
              The world around students is changing rapidly. Academic learning alone does not always provide enough exposure to practical skills, opportunities, communication, creativity, teamwork, and real-world challenges.
            </p>
            <p className="text-slate-500 text-xs sm:text-sm md:text-base">
              YEH aims to create an additional, welcoming space where young people can participate, experiment, learn, showcase their abilities, and discover opportunities beyond the classroom.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {needCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 hover:border-blue-300 hover:shadow-md transition-all duration-300 relative group shadow-xs"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 ${card.badgeColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      {card.title}
                    </h3>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Bridging The Classroom Gap
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mt-4 text-xs sm:text-sm">
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200/70 text-slate-700">
                    <span className="font-bold text-rose-800 block mb-0.5">The Challenge:</span>
                    {card.problem}
                  </div>
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/70 text-slate-700">
                    <span className="font-bold text-emerald-800 block mb-0.5">How YEH Helps:</span>
                    {card.solution}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
