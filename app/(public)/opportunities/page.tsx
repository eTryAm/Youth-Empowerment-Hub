import type { Metadata } from 'next';
import { PageHero } from '@/components/public/page-hero';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { getPublicPlatforms } from '@/lib/public/queries';
import { OpportunitiesGatewayView } from '@/components/public/opportunities-gateway-view';

export const metadata: Metadata = {
  title: 'Opportunities Platform Gateway — Youth Empowerment Hub',
  description: 'Access the official Opportunities Platform for internships, applications, scholarships, and career programs.',
};

export default async function OpportunitiesPage() {
  const allPlatforms = await getPublicPlatforms();
  const opportunitiesPlatform = allPlatforms.find(
    (p) => p.slug === 'opportunities' || p.name.toLowerCase().includes('opportunities')
  );

  return (
    <div className="flex flex-col min-h-[85vh]">
      <PageHero
        title="Opportunities Platform Gateway"
        subtitle="The primary window to access our dedicated platform for youth internships, scholarships, career opportunities, and application forms."
      />

      <SectionWrapper className="bg-slate-50/70 flex-1 flex flex-col justify-center py-12 md:py-16">
        <OpportunitiesGatewayView
          platformUrl={opportunitiesPlatform?.url}
          platformName={opportunitiesPlatform?.name}
          platformDescription={opportunitiesPlatform?.description}
        />
      </SectionWrapper>
    </div>
  );
}