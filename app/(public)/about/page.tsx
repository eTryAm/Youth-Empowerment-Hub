import type { Metadata } from 'next';
import { Globe, Lightbulb, Rocket, Target, Users } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { SectionHeader } from '@/components/shared/section-header';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { getPublicObjectives } from '@/lib/public/queries';
import { objectiveCategories } from '@/config/site';
import { JsonLd } from '@/components/seo/json-ld';
import { webPageSchema } from '@/components/seo/schema';

export const metadata: Metadata = {
  title: 'About Us — Mission, Vision & Values',
  description:
    'Learn about Youth Empowerment Hub — an independent, student-led initiative dedicated to empowering young people through education, skill development, technology, entrepreneurship, and community participation. Discover our mission, vision, and core objectives.',
  keywords: [
    'about youth empowerment hub',
    'YEH mission vision',
    'student-led initiative India',
    'youth development initiative',
    'youth empowerment objectives',
    'independent youth initiative India',
  ],
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Youth Empowerment Hub — Mission, Vision & Values',
    description:
      'India\'s platform for youth empowerment — empowering young people through education, skills, technology, and community development.',
    url: '/about',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'About Youth Empowerment Hub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Youth Empowerment Hub',
    description: 'Learn about our mission to empower India\'s youth through education, skills, and opportunity.',
    images: ['/og-image.jpg'],
  },
};

export default async function AboutPage() {
  const allObjectives = await getPublicObjectives();

  return (
    <div className="flex flex-col">
      <JsonLd
        data={webPageSchema({
          name: 'About Us — Mission, Vision & Values',
          description:
            'Learn about Youth Empowerment Hub — an independent, student-led initiative dedicated to empowering young people.',
          url: 'https://youthempowerment.in/about',
          breadcrumb: [
            { name: 'Home', url: 'https://youthempowerment.in' },
            { name: 'About Us', url: 'https://youthempowerment.in/about' },
          ],
        })}
      />
      <PageHero
        title="About Youth Empowerment Hub"
        subtitle="Empowering youth through access, opportunity, and collaboration to shape a brighter future."
      />

      <SectionWrapper>
        <SectionHeader title="Who We Are" subtitle="Our Identity" centered={false} />
        <div className="text-lg text-slate-700 leading-relaxed max-w-4xl">
          <p>
            Youth Empowerment Hub (YEH) is an <strong>independent, student-led initiative</strong> focused on
            contributing to the welfare, development, confidence, skills, opportunities, and participation of young
            people across India. We are not a registered NGO, trust, or company — we are a grassroots effort built by
            students, for students and young people.
          </p>
          <p className="mt-4">
            Our ecosystem aggregates opportunities, fosters collaboration, and provides essential resources for youth —
            bridging the gap between ambition and achievement by connecting young people with platforms, initiatives, and
            communities that can support their personal and professional growth.
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper className="bg-slate-50">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Our Vision</h2>
            </div>
            <p className="text-lg text-slate-700">
              To be the premier digital destination where every young person can discover their potential,
              access transformative opportunities, and contribute meaningfully to society&apos;s progress.
            </p>
          </div>
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center text-violet-600">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
            </div>
            <p className="text-lg text-slate-700">
              We provide a centralized platform that curates, organizes, and democratizes access to
              educational, entrepreneurial, and civic opportunities, ensuring that systemic barriers do
              not impede individual excellence.
            </p>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper>
        <SectionHeader title="Our Objectives" subtitle="What We Strive to Achieve" />
        {allObjectives.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            {allObjectives.map((obj) => {
              const category = objectiveCategories.find((item) => item.key === obj.category);
              return (
                <div key={obj.id} className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
                  {category ? (
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-3">
                      {category.label}
                    </p>
                  ) : null}
                  <p className="text-slate-700 leading-relaxed">{obj.text}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500">Objectives will appear here once they are published.</p>
          </div>
        )}
      </SectionWrapper>

      <SectionWrapper className="bg-[#0A0F1C] text-white">
        <SectionHeader title="Areas of Focus" subtitle="Strategic Pillars" light />
        <div className="grid md:grid-cols-3 gap-8 text-center mt-12">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 mb-6">
              <Lightbulb className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Innovation & Skills</h3>
            <p className="text-slate-400">
              Equipping youth with future-ready skills through modern education and hands-on experiences.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-400 mb-6">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Community & Network</h3>
            <p className="text-slate-400">
              Building robust networks that connect peers, mentors, and industry leaders.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center text-violet-400 mb-6">
              <Rocket className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-3">Action & Impact</h3>
            <p className="text-slate-400">
              Translating ideas into tangible initiatives that create real-world societal impact.
            </p>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
