'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, Rocket, Target, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Initiative = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  icon?: string;
  url?: string;
};

interface InitiativesSectionProps {
  initiatives: Initiative[];
}

export function InitiativesSection({ initiatives = [] }: InitiativesSectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  
  const categories = ['All', ...Array.from(new Set(initiatives.map(i => i.category).filter(Boolean)))];
  
  const filtered = activeCategory === 'All' ? initiatives : initiatives.filter(i => i.category === activeCategory);
  const displayInitiatives = filtered.slice(0, 6);

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'users': return <Users className="h-6 w-6" />;
      case 'target': return <Target className="h-6 w-6" />;
      case 'rocket': return <Rocket className="h-6 w-6" />;
      default: return <Lightbulb className="h-6 w-6" />;
    }
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50/70 border-t border-slate-200/60">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Our Impact Programs
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Current Initiatives</h2>
          <p className="mt-4 text-slate-600 max-w-2xl text-base sm:text-lg leading-relaxed">
            Explore our ongoing community, skill, and technology projects designed to empower youth.
          </p>
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-all cursor-pointer ${
                  activeCategory === category
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        )}

        {displayInitiatives.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayInitiatives.map((initiative, index) => (
                <motion.div
                  key={initiative.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  viewport={{ once: true }}
                  className="h-full"
                >
                  <div className="h-full flex flex-col bg-white border border-slate-200/80 hover:border-blue-300 hover:shadow-xl transition-all rounded-3xl shadow-sm overflow-hidden p-6 sm:p-7 group">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-5 border border-blue-100/80 shrink-0 font-bold group-hover:scale-110 transition-transform">
                      {getIcon(initiative.icon)}
                    </div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                        {initiative.category || 'General'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {initiative.status}
                      </span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900 line-clamp-1 mb-2">
                      {initiative.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                      {initiative.description}
                    </p>
                    <div className="pt-4 border-t border-slate-100 mt-auto">
                      {initiative.url ? (
                        <Button variant="outline" className="w-full justify-between border-slate-200 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50/50 group rounded-xl font-bold text-slate-700 cursor-pointer" asChild>
                          <Link href={initiative.url}>
                            <span>Learn More</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-blue-600" />
                          </Link>
                        </Button>
                      ) : (
                        <Button variant="ghost" className="w-full justify-between text-slate-400 font-medium" disabled>
                          Details In Preparation
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {initiatives.length > 6 && (
              <div className="mt-12 flex justify-center">
                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 h-12 rounded-2xl group cursor-pointer shadow-md" asChild>
                  <Link href="/initiatives">
                    <span>View All Initiatives</span>
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 shadow-sm max-w-lg mx-auto p-8">
            <Lightbulb className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900">Initiatives In Preparation</h3>
            <p className="text-slate-500 text-sm mt-2">New youth empowerment and technology initiatives will appear here shortly.</p>
          </div>
        )}
      </div>
    </section>
  );
}