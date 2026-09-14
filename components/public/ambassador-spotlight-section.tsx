'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Compass, Heart, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AmbassadorSpotlightSection() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-[#0A0F1C] via-[#0D1527] to-[#0A0F1C] text-white relative overflow-hidden border-t border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />

      <div className="container-custom relative z-10 max-w-5xl">
        <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-8 sm:p-12 md:p-16 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-300 backdrop-blur-md mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Early Contributor Invitation
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-6"
            >
              Build Something Meaningful With Us.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed mb-10 font-normal"
            >
              Become part of the early community helping shape Youth Empowerment Hub as it grows. As an early contributor, you aren&apos;t just joining an established program — you are actively helping build an initiative for students across colleges.
            </motion.p>

            {/* 3 Core Co-Creator Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2.5 font-bold">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Shape the Direction</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Help decide what workshops, contests, and activities we run for students.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2.5 font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Represent Your Campus</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Lead peer outreach, spark student discussions, and share opportunities locally.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2.5 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Authentic Experience</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
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
                className="w-full sm:w-auto h-12 sm:h-13 px-7 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-500/25 border-0"
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
                className="w-full sm:w-auto h-12 sm:h-13 px-6 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm sm:text-base backdrop-blur-md"
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
