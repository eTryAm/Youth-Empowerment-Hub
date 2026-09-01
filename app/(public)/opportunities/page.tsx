import type { Metadata } from 'next';
import { PageHero } from '@/components/public/page-hero';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { getPublicPlatforms } from '@/lib/public/queries';
import { OpportunitiesGatewayView } from '@/components/public/opportunities-gateway-view';

export const metadata: Metadata = {
  title: 'Opportunities & Youth Leadership Portal — Youth Empowerment Hub',
  description: 'Apply for Campus Ambassador, State & District Leadership, Event Volunteering, Sports Organization, and Community Tracks with exclusive rewards and perks.',
};

export default function OpportunitiesPage() {
  return (
    <div className="flex flex-col min-h-[85vh] bg-[#F8FAFC]">
      <PageHero
        title="Opportunities & Leadership Portal"
        subtitle="Explore active youth leadership tracks, campus ambassador roles, event organizing, sports coordination, and exciting rewards across India."
      />

      <SectionWrapper className="bg-slate-50/60 flex-1 flex flex-col justify-center py-12 md:py-20">
        <OpportunitiesGatewayView />
      </SectionWrapper>
    </div>
  );
}