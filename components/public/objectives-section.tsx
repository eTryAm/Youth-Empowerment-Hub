'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Target } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { SectionHeader } from '@/components/shared/section-header'

interface Objective {
  id: string
  text: string
  category: string
  icon?: string
}

interface ObjectivesSectionProps {
  objectives?: Objective[]
}

const categories = [
  { id: 'education_skills', label: 'Education & Skills' },
  { id: 'career_opportunities', label: 'Career & Opportunities' },
  { id: 'technology_innovation', label: 'Technology & Innovation' },
  { id: 'community_welfare', label: 'Community & Welfare' },
  { id: 'collaboration', label: 'Collaboration' }
]

export function ObjectivesSection({ objectives = [] }: ObjectivesSectionProps) {
  const [activeTab, setActiveTab] = useState(categories[0].id)

  if (!objectives || objectives.length === 0) {
    return (
    <SectionWrapper className="bg-[#0A0F1C] text-white">
      <SectionHeader 
        badge="Our Focus Areas" 
        title="What We're Working Towards"
        light
        centered
      />
        <div className="flex flex-col items-center justify-center py-20 text-center border border-slate-800 rounded-2xl bg-slate-900/50 backdrop-blur">
          <Target className="w-12 h-12 text-slate-500 mb-4" />
          <p className="text-slate-400 text-lg">Our objectives are being documented.</p>
        </div>
      </SectionWrapper>
    )
  }

  const filteredObjectives = objectives.filter(obj => obj.category === activeTab)

  return (
    <SectionWrapper className="bg-[#0A0F1C] text-white">
      <SectionHeader 
        badge="Our Focus Areas" 
        title="What We're Working Towards"
        light
        centered
      />
      <div className="mt-8 flex flex-col items-center">
        {/* Tabs */}
        <div className="w-full max-w-4xl overflow-x-auto pb-4 scrollbar-none flex gap-2 md:justify-center border-b border-slate-800">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={cn(
                "relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors",
                activeTab === category.id 
                  ? "text-blue-400" 
                  : "text-slate-400 hover:text-slate-300"
              )}
            >
              {category.label}
              {activeTab === category.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="w-full max-w-4xl mt-8 p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid gap-4"
            >
              {filteredObjectives.length > 0 ? (
                filteredObjectives.map((objective) => (
                  <div key={objective.id} className="flex items-start gap-4 p-4.5 rounded-xl bg-[#111827] border border-slate-800 hover:border-blue-500/40 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-slate-100 text-base sm:text-lg font-medium leading-relaxed">{objective.text}</p>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-40 text-slate-500">
                  No objectives defined for this category yet.
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SectionWrapper>
  )
}
