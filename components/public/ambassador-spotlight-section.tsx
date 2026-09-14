'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Compass, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AmbassadorSpotlightSection() {
  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden border-t border-slate-200/80">
      <div className="container-custom relative z-10 max-w-5xl">
        <div className="rounded-3xl bg-gradient-to-br from-blue-50/80 via-slate-50 to-indigo-50/50 border border-blue-200/80 p-8 sm:p-12 md:p-16 shadow-xl shadow-blue-500/5 relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-50 px-4 py-1.5 text-xs font-semibold text-orange-800 backdrop-blur-md mb-6"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              Early Contributor Invitation
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-6"
            >
              Build Something Meaningful With Us.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed mb-10 font-normal"
            >
              Become part of the early community helping shape Youth Empowerment Hub as it grows. As an early contributor, you aren&apos;t just joining an established program — you are actively helping build an initiative for students across colleges.
            </motion.p>

            {/* 3 Core Co-Creator Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
              <div className="p-5 rounded-2xl bg-white/90 border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mb-3 font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Shape the Direction</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Help decide what workshops, contests, and activities we run for students.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/90 border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-600 flex items-center justify-center mb-3 font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Represent Your Campus</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Lead peer outreach, spark student discussions, and share opportunities locally.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/90 border border-slate-200 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-3 font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Authentic Experience</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  Gain genuine experience in leadership, communication, and event execution.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3.5"
            >
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-12 sm:h-13 px-7 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-500/20 border-0"
              >
                <Link href="/get-involved" className="flex items-center justify-center gap-2">
                  <span>Become a Campus Ambassador</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto h-12 sm:h-13 px-6 rounded-2xl border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm sm:text-base shadow-xs"
              >
                <Link href="/about">
                  <span>Learn About the Role</span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
