'use client'

import { BookOpen, Wrench, Monitor, Briefcase, Lightbulb, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SectionWrapper } from '@/components/shared/section-wrapper'
import { SectionHeader } from '@/components/shared/section-header'

const coreAreas = [
  {
    title: 'Knowledge & Education',
    description: 'Providing access to learning resources and educational pathways for continuous growth.',
    icon: BookOpen,
    color: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
  },
  {
    title: 'Practical Skills',
    description: 'Hands-on training and workshops to develop real-world capabilities.',
    icon: Wrench,
    color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
  },
  {
    title: 'Digital Literacy',
    description: 'Equipping youth with the technological skills needed for the modern digital economy.',
    icon: Monitor,
    color: 'bg-violet-500/10 text-violet-500 border-violet-500/20'
  },
  {
    title: 'Career & Opportunities',
    description: 'Connecting talent with meaningful employment, internships, and networking.',
    icon: Briefcase,
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
  },
  {
    title: 'Innovation & Entrepreneurship',
    description: 'Fostering creative problem-solving and supporting new youth-led ventures.',
    icon: Lightbulb,
    color: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
  },
  {
    title: 'Community & Mentorship',
    description: 'Building strong support networks through peer connection and expert guidance.',
    icon: Users,
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
  }
]

export function MissionSection() {
  return (
    <SectionWrapper className="bg-slate-50/50">
      <SectionHeader 
        badge="Our Philosophy" 
        title="What We Believe"
        subtitle="We believe in a holistic approach to youth development, focusing on these core areas to build well-rounded, capable leaders."
        centered
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {coreAreas.map((area, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group p-6 rounded-2xl bg-white border border-slate-200 shadow-sm transition-all hover:shadow-md card-hover"
          >
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center border mb-4", area.color)}>
              <area.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">{area.title}</h3>
            <p className="text-slate-600 leading-relaxed">{area.description}</p>
          </motion.div>
        ))}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 text-center max-w-3xl mx-auto"
      >
        <p className="text-lg text-slate-600 font-medium">
          The Youth Empowerment Hub brings these pillars together into a cohesive ecosystem, 
          ensuring that every young person has the resources, guidance, and opportunities 
          they need to thrive in a rapidly changing world.
        </p>
      </motion.div>
    </SectionWrapper>
  )
}
