import type { Metadata } from 'next';
import { PageHero } from '@/components/public/page-hero';
import { SectionHeader } from '@/components/shared/section-header';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { Button } from '@/components/ui/button';
import { Handshake, Building2, GraduationCap, Users2, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Partner With Us — Youth Empowerment Hub',
  description: 'Collaborate with Youth Empowerment Hub to sponsor youth initiatives, host internships, or deliver educational programs.',
};

export default function GetInvolvedPage() {
  return (
    <div className="flex flex-col">
      <PageHero
        title="Partner With Us"
        subtitle="Collaborate with our central organization to create scalable youth programs, host mentorship cohorts, and expand educational reach."
      />

      <SectionWrapper className="bg-slate-50/70 py-12 md:py-16">
        <SectionHeader 
          badge="Institutional Alliances"
          title="Collaboration Opportunities" 
          subtitle="Explore how your enterprise, university, or nonprofit organization can partner with our digital ecosystem."
          centered 
        />

        <div className="grid md:grid-cols-2 gap-8 mt-10 max-w-5xl mx-auto">
          {[
            {
              icon: Building2,
              title: 'Corporate & Industry Partners',
              desc: 'Host specialized tech cohorts, fund innovation challenges, sponsor hardware labs, or list direct corporate internship openings.',
              cta: 'Partner as an Enterprise',
            },
            {
              icon: GraduationCap,
              title: 'Educational Institutions',
              desc: 'Integrate our skill modules, hackathons, and career guidance workshops into university and college student curriculum.',
              cta: 'Partner as an Academic Institute',
            },
            {
              icon: Users2,
              title: 'Community Foundations & NGOs',
              desc: 'Join our grassroots welfare programs to bring technical skills, sports programs, and mentorship to underserved communities.',
              cta: 'Partner as a Community NGO',
            },
            {
              icon: ShieldCheck,
              title: 'Mentorship & Industry Experts',
              desc: 'Contribute guest lectures, industry seminars, code reviews, or career development advisory sessions to emerging talent.',
              cta: 'Join as an Industry Mentor',
            },
          ].map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full hover:shadow-md hover:border-blue-200 transition-all"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-blue-50 text-blue-600 border border-blue-100 font-bold">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 flex-1">
                  {card.desc}
                </p>
                <div>
                  <Button asChild className="bg-slate-900 hover:bg-blue-600 text-white font-semibold rounded-xl w-full sm:w-auto">
                    <Link href={`/contact?category=Partnership&subject=${encodeURIComponent(card.title)}`}>
                      {card.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </SectionWrapper>
    </div>
  );
}