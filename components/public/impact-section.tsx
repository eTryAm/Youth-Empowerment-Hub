'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ContentIcon } from '@/components/public/content-icon';

type Metric = {
  id: string;
  label: string;
  value?: string | null;
  icon?: string | null;
};

interface ImpactSectionProps {
  metrics: Metric[];
}

const CountUp = ({ to }: { to: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let start = 0;
    const duration = 2000;
    const increment = to / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= to) {
        setCount(to);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [to, isInView]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
};

export function ImpactSection({ metrics = [] }: ImpactSectionProps) {
  if (metrics.length === 0) {
    return (
      <section className="py-24 bg-[#0A0F1C] relative overflow-hidden text-slate-50">
        <div className="container px-4 md:px-6 relative z-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-4">Making a Difference</h2>
          <p className="text-cyan-100/70 max-w-2xl mx-auto text-lg">
            Impact metrics will appear here once they are published.
          </p>
        </div>
      </section>
    );
  }

  const hasNumericalValues = metrics.some((m) => {
    const digits = (m.value || '').replace(/[^0-9]/g, '');
    return digits.length > 0 && !Number.isNaN(parseInt(digits, 10));
  });

  const renderValue = (val?: string | null) => {
    if (!val) return '—';
    const value = val.trim();
    if (!value) return '—';
    const match = value.match(/^([^0-9]*)([0-9,.]+)(.*)$/);
    if (match) {
      const prefix = match[1] || '';
      const numStr = match[2].replace(/,/g, '');
      const suffix = match[3] || '';
      const num = parseFloat(numStr);
      if (!isNaN(num) && num > 0) {
        return (
          <span className="flex items-center">
            {prefix}
            <CountUp to={num} />
            {suffix}
          </span>
        );
      }
    }
    return value;
  };

  return (
    <section className="py-24 bg-[#0A0F1C] relative overflow-hidden text-white">
      {/* Mesh background effect */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-900/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-15 pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide uppercase mb-4 border border-cyan-400/30 bg-cyan-500/10 text-cyan-300 backdrop-blur-md">
            Our Measurable Impact
          </div>
          <h2 className="text-3xl font-bold tracking-tight md:text-5xl text-white">Making a Tangible Difference</h2>
          <p className="mt-4 text-slate-300 max-w-2xl text-lg">
            Empowering youth across education, technology, career development, and community welfare.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300">
                <ContentIcon name={metric.icon || 'Sparkles'} className="w-7 h-7" />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight flex items-baseline">
                {renderValue(metric.value)}
              </div>
              <div className="text-base font-semibold text-cyan-100/90 mb-1">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>

        {!hasNumericalValues && (
          <p className="mt-8 text-center text-xs text-slate-400">
            Metrics reflect qualitative and ongoing developmental achievements.
          </p>
        )}
      </div>
    </section>
  );
}