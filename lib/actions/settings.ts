'use server';

import { db } from '@/lib/db';
import { siteSettings, featureFlags, homepageSections } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { createAuditLog, AUDIT_ACTIONS } from './audit';

// ── Site Settings ──

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const settings = await db.select().from(siteSettings);
    return Object.fromEntries(settings.map((s) => [s.key, s.value ?? '']));
  } catch (error) {
    console.error('[getSiteSettings]', error);
    return {};
  }
}

export async function updateSiteSettings(data: Record<string, string>) {
  const user = await requirePermission('settings.edit');

  for (const [key, value] of Object.entries(data)) {
    await db
      .insert(siteSettings)
      .values({ key, value, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedAt: new Date() },
      });
  }

  await createAuditLog({
    userId: user.id,
    action: AUDIT_ACTIONS.SETTINGS_UPDATED,
    entityType: 'settings',
    metadata: { keys: Object.keys(data) },
  });

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function updateSiteSetting(key: string, value: string) {
  return updateSiteSettings({ [key]: value });
}

// ── Feature Flags ──

export async function getFeatureFlags(): Promise<Record<string, boolean>> {
  try {
    const flags = await db.select().from(featureFlags);
    return Object.fromEntries(flags.map((f) => [f.key, f.enabled ?? false]));
  } catch (error) {
    console.error('[getFeatureFlags]', error);
    return {};
  }
}

export async function updateFeatureFlag(key: string, enabled: boolean) {
  const user = await requirePermission('features.edit');

  await db
    .insert(featureFlags)
    .values({ key, enabled, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: featureFlags.key,
      set: { enabled, updatedAt: new Date() },
    });

  await createAuditLog({
    userId: user.id,
    action: AUDIT_ACTIONS.FEATURE_FLAG_UPDATED,
    entityType: 'feature_flag',
    metadata: { key, enabled },
  });

  revalidatePath('/', 'layout');
  return { success: true };
}

export async function toggleFeatureFlag(key: string, enabled: boolean) {
  return updateFeatureFlag(key, enabled);
}

// ── Homepage Sections ──

export async function getHomepageSections() {
  try {
    const sections = await db
      .select()
      .from(homepageSections)
      .orderBy(homepageSections.displayOrder);
    return sections;
  } catch (error) {
    console.error('[getHomepageSections]', error);
    return [];
  }
}

export async function updateHomepageSection(
  sectionKey: string,
  data: { visible?: boolean; displayOrder?: number; title?: string; subtitle?: string; config?: Record<string, unknown> }
) {
  const user = await requirePermission('homepage.edit');

  await db
    .update(homepageSections)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(homepageSections.sectionKey, sectionKey));

  await createAuditLog({
    userId: user.id,
    action: AUDIT_ACTIONS.HOMEPAGE_UPDATED,
    entityType: 'homepage_section',
    metadata: { sectionKey, changes: data },
  });

  revalidatePath('/');
  revalidatePath('/admin/homepage');
  return { success: true };
}

export async function toggleHomepageSection(sectionKey: string, visible: boolean) {
  return updateHomepageSection(sectionKey, { visible });
}

export async function reorderHomepageSections(ordered: string[] | { sectionKey: string; displayOrder?: number }[]) {
  const user = await requirePermission('homepage.edit');

  const orderedKeys = Array.isArray(ordered) && typeof ordered[0] === 'object'
    ? (ordered as { sectionKey: string }[]).map(o => o.sectionKey)
    : (ordered as string[]);

  for (let i = 0; i < orderedKeys.length; i++) {
    await db
      .update(homepageSections)
      .set({ displayOrder: i, updatedAt: new Date() })
      .where(eq(homepageSections.sectionKey, orderedKeys[i]));
  }

  await createAuditLog({
    userId: user.id,
    action: AUDIT_ACTIONS.HOMEPAGE_UPDATED,
    entityType: 'homepage_section',
    metadata: { action: 'reorder', order: orderedKeys },
  });

  revalidatePath('/');
  revalidatePath('/admin/homepage');
  return { success: true };
}