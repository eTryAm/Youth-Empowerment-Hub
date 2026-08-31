import type { Metadata } from 'next';
import { PageHero } from '@/components/public/page-hero';
import { ContentIcon } from '@/components/public/content-icon';
import { SectionHeader } from '@/components/shared/section-header';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { getPublicMetrics, getPublicTestimonials } from '@/lib/public/queries';
import { ImpactStoriesSlider } from '@/components/public/impact-stories-slider';

export const metadata: Metadata = {
  title: 'Impact',
  description: 'See how Youth Empowerment Hub is building opportunities for young people.',
};

export default async function ImpactPage() {
  const [metrics, testimonials] = await Promise.all([
    getPublicMetrics(),
    getPublicTestimonials(),
  ]);

  const stories = testimonials.map((t) => ({
    id: t.id,
    quote: t.testimonialText,
    name: t.personName,
    designation: t.designation ?? '',
    organization: t.organization ?? undefined,
    avatarUrl: t.photoUrl ?? undefined,
    rating: t.rating ?? 5,
  }));

  return (
    <div className="flex flex-col">
      <PageHero
        title="Our Impact"
        subtitle="The real measure of our work is in lives changed and futures built. We share only verified, published outcomes."
      />

      <SectionWrapper className="bg-white">
        {metrics.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric) => (
              <div
                key={metric.id}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <ContentIcon name={metric.icon} className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-extrabold text-slate-900 mb-2">
                  {metric.value?.trim() ? metric.value : '—'}
                </h3>
                <p className="text-lg font-bold text-slate-700 mb-2">{metric.label}</p>
                {metric.description ? <p className="text-sm text-slate-500">{metric.description}</p> : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500">Impact metrics will appear here once they are published.</p>
          </div>
        )}
      </SectionWrapper>

      <SectionWrapper className="bg-slate-50">
        <SectionHeader title="Stories of Change" subtitle="Qualitative Impact" />
        <div className="grid md:grid-cols-2 gap-12 mt-8 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-slate-900 leading-tight">Beyond the numbers</h3>
            <p className="text-lg text-slate-700 leading-relaxed">
              Metrics give a snapshot, but the true measure of success is in the personal transformations of
              the youth we serve. Through mentorship, access to technology, and peer support, young people
              grow into confident contributors in their communities.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              Every initiative, program, and community event creates ripples of change that extend far beyond
              our immediate network.
            </p>
          </div>

          <div>
            <ImpactStoriesSlider stories={stories} />
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}