'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function FinalJoinCta() {
  return (
    <section className="py-20 sm:py-24 bg-white relative overflow-hidden border-t border-slate-200/80">
      <div className="container-custom relative z-10 max-w-4xl">
        <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0F172A] border border-slate-800 p-8 sm:p-14 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          {/* Subtle Ambience */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/15 px-4 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Join The Movement
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6"
          >
            Be Part of the Beginning.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-normal mb-10"
          >
            Great communities do not appear overnight. They are built by people who choose to participate, contribute, and grow together.
          </motion.p>

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
              className="w-full sm:w-auto h-12 sm:h-13 px-8 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-500/25 border-0"
            >
              <Link href="/get-involved" className="flex items-center justify-center gap-2">
                <span>Join the Initiative</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto h-12 sm:h-13 px-7 rounded-2xl border-white/20 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm sm:text-base backdrop-blur-md"
            >
              <Link href="/platforms" className="flex items-center justify-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Explore Opportunities</span>
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
