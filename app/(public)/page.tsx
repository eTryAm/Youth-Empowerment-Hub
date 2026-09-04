import { Hero } from '@/components/public/hero';
import { MissionSection } from '@/components/public/mission-section';
import { ObjectivesSection } from '@/components/public/objectives-section';
import { PlatformsSection } from '@/components/public/platforms-section';
import { InitiativesSection } from '@/components/public/initiatives-section';
import { EventsSection } from '@/components/public/events-section';
import { GalleryGlimpsesSection } from '@/components/public/gallery-glimpses-section';
import { FutureVisionSection } from '@/components/public/future-vision-section';
import { ImpactSection } from '@/components/public/impact-section';
import { GetInvolvedSection } from '@/components/public/get-involved-section';
import { TestimonialsSection } from '@/components/public/testimonials-section';
import { PartnersSection } from '@/components/public/partners-section';
import { DonationCta } from '@/components/public/donation-cta';
import {
  getHomepageSectionVisibility,
  getPublicEvents,
  getPublicFeatureFlags,
  getPublicGalleryItems,
  getPublicInitiatives,
  getPublicMetrics,
  getPublicObjectives,
  getPublicPartners,
  getPublicPlatforms,
  getPublicSettings,
  getPublicTestimonials,
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
    dbObjectives,
    dbInitiatives,
    dbEvents,
    dbGalleryItems,
    dbMetrics,
    dbTestimonials,
    dbPartners,
  ] = await Promise.all([
    getPublicSettings(),
    getPublicFeatureFlags(),
    getHomepageSectionVisibility(),
    getPublicPlatforms(),
    getPublicObjectives(),
    getPublicInitiatives(),
    getPublicEvents({ upcomingOnly: true }),
    getPublicGalleryItems(),
    getPublicMetrics(),
    getPublicTestimonials(),
    getPublicPartners(),
  ]);

  const objectives = dbObjectives.map((o) => ({
    id: o.id,
    text: o.text,
    category: o.category,
    icon: o.icon ?? undefined,
  }));

  const initiatives = dbInitiatives.map((i) => ({
    id: i.id,
    title: i.title,
    description: i.description ?? '',
    category: i.category ?? 'General',
    status: i.status ?? 'Active',
    icon: i.icon ?? undefined,
    url: i.ctaUrl ?? undefined,
  }));

  const testimonials = dbTestimonials.map((t) => ({
    id: t.id,
    quote: t.testimonialText,
    name: t.personName,
    designation: t.designation ?? '',
    organization: t.organization ?? undefined,
    avatarUrl: t.photoUrl ?? undefined,
    rating: t.rating ?? 5,
  }));

  const partners = dbPartners.map((p) => ({
    id: p.id,
    name: p.name,
    logoUrl: p.logoUrl ?? '',
    websiteUrl: p.website ?? undefined,
  }));

  return (
    <div className="flex flex-col space-y-0">
      <JsonLd data={[organizationSchema, websiteSchema]} />
      {isVisible('hero') ? (
        <Hero
          heroConfig={{
            heading: settings.tagline || siteConfig.tagline,
            subheading: settings.hero_subheading || siteConfig.description,
          }}
          platforms={dbPlatforms}
        />
      ) : null}

      {isVisible('platforms') ? <PlatformsSection platforms={dbPlatforms} /> : null}

      {isVisible('mission') ? <MissionSection /> : null}

      {isVisible('objectives') && objectives.length > 0 ? (
        <ObjectivesSection objectives={objectives} />
      ) : null}

      {isVisible('initiatives') && initiatives.length > 0 ? (
        <InitiativesSection initiatives={initiatives} />
      ) : null}

      {isVisible('events') && flags.events_enabled !== false && dbEvents.length > 0 ? (
        <EventsSection events={dbEvents} />
      ) : null}

      {isVisible('gallery') && flags.gallery_enabled !== false && dbGalleryItems.length > 0 ? (
        <GalleryGlimpsesSection items={dbGalleryItems} />
      ) : null}

      {isVisible('future_vision') ? <FutureVisionSection /> : null}

      {isVisible('impact') ? <ImpactSection metrics={dbMetrics} /> : null}

      {isVisible('get_involved') && flags.get_involved_enabled !== false ? (
        <GetInvolvedSection />
      ) : null}

      {isVisible('testimonials') && flags.testimonials_enabled !== false ? (
        <TestimonialsSection testimonials={testimonials} />
      ) : null}

      {isVisible('partners') && flags.partners_enabled !== false && partners.length > 0 ? (
        <PartnersSection partners={partners} />
      ) : null}

      {isVisible('donation_cta') && flags.donation_enabled ? (
        <DonationCta
          donationEnabled={Boolean(flags.donation_enabled)}
          donationUrl={settings.donation_url || undefined}
        />
      ) : null}
    </div>
  );
}