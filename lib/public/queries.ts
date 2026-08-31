import { and, asc, desc, eq, gte, inArray } from 'drizzle-orm';
import { db } from '@/lib/db';
import {
  announcements,
  events,
  featureFlags,
  galleryItems,
  getInvolvedLinks,
  homepageSections,
  impactMetrics,
  initiatives,
  navigationItems,
  objectives,
  partners,
  platforms,
  siteSettings,
  testimonials,
} from '@/lib/db/schema';
import { defaultNavItems } from '@/config/site';
import { involvedContactHref } from '@/lib/public/contact';

export const PUBLIC_PLATFORM_STATUSES = [
  'live',
  'coming_soon',
  'under_development',
  'temporarily_unavailable',
] as const;

export async function getPublicSettings(): Promise<Record<string, string>> {
  try {
    const rows = await db.select().from(siteSettings);
    return Object.fromEntries(rows.map((s) => [s.key, s.value ?? '']));
  } catch {
    return {};
  }
}

export async function getPublicFeatureFlags(): Promise<Record<string, boolean>> {
  try {
    const rows = await db.select().from(featureFlags);
    return Object.fromEntries(rows.map((f) => [f.key, f.enabled ?? false]));
  } catch {
    return {};
  }
}

export async function getPublicNavItems() {
  try {
    const rows = await db
      .select()
      .from(navigationItems)
      .where(eq(navigationItems.visible, true))
      .orderBy(asc(navigationItems.displayOrder));
    if (rows.length > 0) {
      return rows.map((item) => ({ label: item.label, url: item.url }));
    }
  } catch {
    // fall through to defaults
  }
  return defaultNavItems.map((item) => ({ label: item.label, url: item.url }));
}

export async function getHomepageSectionVisibility() {
  try {
    const rows = await db
      .select()
      .from(homepageSections)
      .orderBy(asc(homepageSections.displayOrder));
    return {
      sections: rows,
      isVisible: (key: string) => {
        if (rows.length === 0) return true;
        const match = rows.find((s) => s.sectionKey === key);
        return match ? Boolean(match.visible) : true;
      },
    };
  } catch {
    return { sections: [], isVisible: () => true };
  }
}

export async function getActiveAnnouncement() {
  try {
    const featured = await db
      .select()
      .from(announcements)
      .where(and(eq(announcements.status, 'published'), eq(announcements.featured, true)))
      .orderBy(desc(announcements.createdAt))
      .limit(1);
    if (featured[0]) return featured[0];

    const latest = await db
      .select()
      .from(announcements)
      .where(eq(announcements.status, 'published'))
      .orderBy(desc(announcements.createdAt))
      .limit(1);
    return latest[0] ?? null;
  } catch (error) {
    console.error('[getActiveAnnouncement]', error);
    return null;
  }
}

export async function getAllPublishedAnnouncements(limit = 10) {
  try {
    return await db
      .select()
      .from(announcements)
      .where(eq(announcements.status, 'published'))
      .orderBy(desc(announcements.featured), desc(announcements.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('[getAllPublishedAnnouncements]', error);
    return [];
  }
}

export async function getPublicPlatforms() {
  try {
    return await db
      .select()
      .from(platforms)
      .where(inArray(platforms.status, [...PUBLIC_PLATFORM_STATUSES]))
      .orderBy(asc(platforms.displayOrder));
  } catch {
    return [];
  }
}

export async function getPublicObjectives() {
  try {
    return await db
      .select()
      .from(objectives)
      .where(eq(objectives.status, 'published'))
      .orderBy(asc(objectives.displayOrder));
  } catch {
    return [];
  }
}

export async function getPublicInitiatives() {
  try {
    return await db
      .select()
      .from(initiatives)
      .where(eq(initiatives.status, 'published'))
      .orderBy(asc(initiatives.displayOrder));
  } catch {
    return [];
  }
}

export async function getPublicEvents(opts?: { upcomingOnly?: boolean }) {
  try {
    const conditions = [eq(events.status, 'published')];
    if (opts?.upcomingOnly) {
      conditions.push(gte(events.date, new Date()));
    }
    return await db
      .select()
      .from(events)
      .where(and(...conditions))
      .orderBy(opts?.upcomingOnly ? asc(events.date) : desc(events.date));
  } catch {
    return [];
  }
}

export async function getAllPublishedEvents() {
  try {
    return await db
      .select()
      .from(events)
      .where(eq(events.status, 'published'))
      .orderBy(desc(events.date));
  } catch {
    return [];
  }
}

export async function getPublicMetrics() {
  try {
    return await db
      .select()
      .from(impactMetrics)
      .where(eq(impactMetrics.status, 'published'))
      .orderBy(asc(impactMetrics.displayOrder));
  } catch {
    return [];
  }
}

export async function getPublicGetInvolvedLinks() {
  try {
    const rows = await db
      .select()
      .from(getInvolvedLinks)
      .where(eq(getInvolvedLinks.status, 'published'))
      .orderBy(asc(getInvolvedLinks.displayOrder));
    return rows.map((link) => ({
      ...link,
      url: link.url || involvedContactHref(link.title),
    }));
  } catch {
    return [];
  }
}

export async function getPublicTestimonials() {
  try {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.status, 'published'))
      .orderBy(desc(testimonials.featured), desc(testimonials.createdAt));
  } catch {
    return [];
  }
}

export async function getPublicPartners() {
  try {
    return await db
      .select()
      .from(partners)
      .where(eq(partners.status, 'published'))
      .orderBy(asc(partners.displayOrder));
  } catch {
    return [];
  }
}

export async function getPublicGalleryItems(options?: {
  featuredOnly?: boolean;
  category?: string;
  limit?: number;
}) {
  try {
    const conditions = [eq(galleryItems.status, 'published')];
    if (options?.featuredOnly) {
      conditions.push(eq(galleryItems.featured, true));
    }
    if (options?.category && options.category !== 'All') {
      conditions.push(eq(galleryItems.category, options.category));
    }

    const query = db
      .select()
      .from(galleryItems)
      .where(and(...conditions))
      .orderBy(asc(galleryItems.displayOrder), desc(galleryItems.eventDate), desc(galleryItems.createdAt));

    if (options?.limit) {
      return await query.limit(options.limit);
    }
    return await query;
  } catch (error) {
    console.error('[getPublicGalleryItems]', error);
    return [];
  }
}


