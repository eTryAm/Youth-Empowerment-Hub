'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  dark?: boolean;
  subtle?: boolean;
  noPadding?: boolean;
  fullWidth?: boolean;
}

export function SectionWrapper({ id, className, children, dark, subtle, noPadding, fullWidth }: SectionWrapperProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  return (
    <section
      id={id}
      ref={ref}
      className={cn(
        !noPadding && 'py-12 md:py-16',
        dark && 'section-dark bg-[#0A0F1C] text-white',
        subtle && 'section-subtle bg-slate-50',
        !dark && !subtle && 'section-light bg-white',
        className
      )}
    >
      <motion.div
        className={cn(!fullWidth && 'container-custom')}
        initial={{ opacity: 0, y: 15 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}