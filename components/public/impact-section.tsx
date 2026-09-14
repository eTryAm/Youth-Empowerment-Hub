'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ContentIcon } from '@/components/public/content-icon';
import { TrendingUp, Sparkles } from 'lucide-react';

type Metric = {
  id: string;
  label: string;
  value?: string | null;
  icon?: string | null;
  description?: string | null;
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
    const duration = 1800;
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
    return null;
  }

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
    <section className="py-20 sm:py-24 bg-slate-50/70 relative overflow-hidden text-slate-900 border-t border-slate-200/80">
      <div className="container-custom relative z-10">
        <div className="flex flex-col items-center text-center mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-xs font-semibold tracking-wide uppercase mb-4 border border-blue-200 bg-blue-50 text-blue-700 backdrop-blur-md">
            <TrendingUp className="w-3.5 h-3.5" />
            Initiative Reach & Engagement
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 mb-4">
            Our Active Milestones
          </h2>
          <p className="text-slate-600 max-w-2xl text-sm sm:text-base leading-relaxed">
            Real metrics driven by student participation, campus chapter activities, and community initiatives across colleges.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                <ContentIcon name={metric.icon || 'Sparkles'} className="w-6 h-6" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 mb-2 tracking-tight flex items-baseline">
                {renderValue(metric.value)}
              </div>
              <div className="text-sm font-bold text-slate-800 mb-1">
                {metric.label}
              </div>
              {metric.description && (
                <div className="text-xs text-slate-500 leading-relaxed font-normal mt-1">
                  {metric.description}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Verified student participation data managed live by the initiative coordination team.
          </span>
        </div>
      </div>
    </section>
  );
}