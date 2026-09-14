import { Hero } from '@/components/public/hero';
import { TrustStrip } from '@/components/public/trust-strip';
import { WhatIsYehSection } from '@/components/public/what-is-yeh-section';
import { WhyStartedSection } from '@/components/public/why-started-section';
import { EcosystemBuildingSection } from '@/components/public/ecosystem-building-section';
import { EventsSection } from '@/components/public/events-section';
import { ImpactSection } from '@/components/public/impact-section';
import { ParticipationRolesSection } from '@/components/public/participation-roles-section';
import { TransparencyStatusSection } from '@/components/public/transparency-status-section';
import { FutureRoadmapSection } from '@/components/public/future-roadmap-section';
import { AccountabilitySection } from '@/components/public/accountability-section';
import { FinalJoinCta } from '@/components/public/final-join-cta';
import { DonationCta } from '@/components/public/donation-cta';
import {
  getHomepageSectionVisibility,
  getPublicEvents,
  getPublicFeatureFlags,
  getPublicMetrics,
  getPublicPlatforms,
  getPublicSettings,
} from '@/lib/public/queries';
import { siteConfig } from '@/config/site';
import { JsonLd } from '@/components/seo/json-ld';
import { organizationSchema, websiteSchema } from '@/components/seo/schema';

export default async function HomePage() {
  const [
    settings,
    flags,
    { isVisible },
    dbPlatforms,
    dbEvents,
    dbMetrics,
  ] = await Promise.all([
    getPublicSettings(),
    getPublicFeatureFlags(),
    getHomepageSectionVisibility(),
    getPublicPlatforms(),
    getPublicEvents({ upcomingOnly: true }),
    getPublicMetrics(),
  ]);

  return (
    <div className="flex flex-col space-y-0 overflow-x-hidden">
      <JsonLd data={[organizationSchema, websiteSchema]} />

      {/* 1. Hero Section */}
      {isVisible('hero') ? (
        <Hero
          heroConfig={{
            heading: settings.tagline || siteConfig.tagline,
            subheading: settings.hero_subheading || siteConfig.description,
          }}
          platforms={dbPlatforms}
        />
      ) : null}

      {/* 2. Trust & Positioning Strip */}
      <TrustStrip />

      {/* 3. What is YEH? */}
      {isVisible('mission') ? <WhatIsYehSection /> : null}

      {/* 4. Why We Started */}
      {isVisible('objectives') ? <WhyStartedSection /> : null}

      {/* 5. What We Are Building & Digital Ecosystem */}
      {isVisible('platforms') ? (
        <EcosystemBuildingSection platforms={dbPlatforms} />
      ) : null}

      {/* 6. Dynamic Upcoming Events (if active in database) */}
      {isVisible('events') && flags.events_enabled !== false && dbEvents.length > 0 ? (
        <EventsSection events={dbEvents} />
      ) : null}

      {/* 7. Admin-Controlled Verified Milestones & Reach */}
      {isVisible('impact') && dbMetrics.length > 0 ? (
        <ImpactSection metrics={dbMetrics} />
      ) : null}

      {/* 8. Explore & Grab Opportunities Gateway */}
      {isVisible('get_involved') && flags.get_involved_enabled !== false ? (
        <ParticipationRolesSection platforms={dbPlatforms} />
      ) : null}

      {/* 9. Dedicated Transparency Commitment & Current Stage */}
      <TransparencyStatusSection />

      {/* 11. Progressive Future Vision Roadmap */}
      {isVisible('future_vision') ? <FutureRoadmapSection /> : null}

      {/* 12. Trust & Accountability Mechanisms */}
      <AccountabilitySection />

      {/* 13. Final CTA Banner */}
      <FinalJoinCta />

      {/* 14. Optional Community Contribution CTA (if enabled by admin) */}
      {isVisible('donation_cta') && flags.donation_enabled ? (
        <DonationCta
          donationEnabled={Boolean(flags.donation_enabled)}
          donationUrl={settings.donation_url || undefined}
        />
      ) : null}
    </div>
  );
}