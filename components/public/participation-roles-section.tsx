'use client';

import { motion } from 'framer-motion';
import { GraduationCap, HeartHandshake, Users, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const participationRoles = [
  {
    title: 'Campus Ambassador',
    badge: 'Popular Role',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: GraduationCap,
    description: 'Be the voice of Youth Empowerment Hub in your college or university. Connect peers to learning labs, competitions, and events.',
    contribution: 'Host campus info sessions, form student discussion groups, and coordinate event participation.',
    eligibility: 'Currently enrolled college/university student passionate about peer growth.',
    ctaText: 'Apply as Ambassador',
    ctaLink: '/contact?category=Volunteering',
    available: true,
  },
  {
    title: 'Volunteer',
    badge: 'Open Application',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    icon: HeartHandshake,
    description: 'Support active initiatives behind the scenes across technology, content creation, social media, event management, and outreach.',
    contribution: 'Contribute 2–4 hours weekly toward event logistics, design, tech support, or community management.',
    eligibility: 'Any student or recent graduate eager to gain practical collaborative experience.',
    ctaText: 'Join as Volunteer',
    ctaLink: '/contact?category=Volunteering',
    available: true,
  },
  {
    title: 'Community Member',
    badge: 'Instant Access',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Users,
    description: 'Participate actively in workshops, quizzes, sports meets, and skill challenges while building meaningful connections.',
    contribution: 'Engage in open community sessions, give feedback on activities, and learn with peers.',
    eligibility: 'Open to all students and youth across India.',
    ctaText: 'Join Community',
    ctaLink: '/get-involved',
    available: true,
  },
  {
    title: 'District / State Representative',
    badge: 'Expanding Soon',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: MapPin,
    description: 'Help coordinate inter-college activities and regional student chapters as the initiative expands into new districts.',
    contribution: 'Regional outreach, student chapter coordination, and local event management.',
    eligibility: 'Experienced student leaders or active community contributors.',
    ctaText: 'Express Interest',
    ctaLink: '/contact?category=General%20Inquiry',
    available: false,
  },
];

export function ParticipationRolesSection() {
  return (
    <section id="how-to-participate" className="py-20 sm:py-24 bg-white text-slate-900 relative overflow-hidden border-t border-slate-200/80">
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-700 backdrop-blur-md mb-4"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Participation Pathways
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-6"
          >
            There&apos;s More Than One Way to Contribute
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed font-normal"
          >
            Whether you want to lead on your campus, support events with your technical or creative skills, or simply participate and learn — there is a place for you in our student community.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {participationRoles.map((role, idx) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="rounded-3xl bg-slate-50/70 border border-slate-200/90 p-6 sm:p-8 hover:border-blue-300 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${role.badgeColor}`}>
                      {role.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">
                    {role.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-5">
                    {role.description}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-200/60 text-xs">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">
                        <strong className="text-slate-900 font-semibold">Expected Role:</strong> {role.contribution}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">
                        <strong className="text-slate-900 font-semibold">Eligibility:</strong> {role.eligibility}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-200/60">
                  <Button
                    asChild
                    className="w-full h-11 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm hover:shadow-md"
                  >
                    <Link href={role.ctaLink} className="flex items-center justify-center gap-2">
                      <span>{role.ctaText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Responsible Transparency Callout */}
        <div className="mt-12 text-center max-w-2xl mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-900">Participation Notice:</span> All roles are volunteer and student participation opportunities created for experiential learning and community service. YEH does not offer salaried employment or make commercial placement guarantees.
        </div>
      </div>
    </section>
  );
}
