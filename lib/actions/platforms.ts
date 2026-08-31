'use server';

import { db } from '@/lib/db';
import { platforms } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { createPlatformSchema, updatePlatformSchema } from '@/lib/validators/platform';
import { createAuditLog, AUDIT_ACTIONS } from './audit';
import { slugify } from '@/lib/utils';

export async function createPlatform(formData: FormData) {
  const user = await requirePermission('platforms.create');
  
  const raw: Record<string, any> = Object.fromEntries(formData);
  // Parse booleans
  raw.featured = raw.featured === 'on' || raw.featured === 'true' || raw.featured === true;
  raw.openInNewTab = raw.openInNewTab === 'on' || raw.openInNewTab === 'true' || raw.openInNewTab === true;
  
  const parsed = createPlatformSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('[createPlatform] Validation failed:', parsed.error.flatten());
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.name);

  const [platform] = await db.insert(platforms).values({
    ...data,
    slug,
  }).returning();

  if (platform) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.PLATFORM_CREATED,
      entityType: 'platform',
      entityId: platform.id,
      metadata: { name: platform.name },
    });
  }

  revalidatePath('/admin/platforms');
  revalidatePath('/platforms');
  revalidatePath('/');
  return { success: true, data: platform };
}

export async function updatePlatform(id: string, formData: FormData) {
  const user = await requirePermission('platforms.edit');
  
  const raw: Record<string, any> = Object.fromEntries(formData);
  raw.id = id;
  // Parse booleans
  raw.featured = raw.featured === 'on' || raw.featured === 'true' || raw.featured === true;
  raw.openInNewTab = raw.openInNewTab === 'on' || raw.openInNewTab === 'true' || raw.openInNewTab === true;
  
  const parsed = updatePlatformSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('[updatePlatform] Validation failed:', parsed.error.flatten());
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  const [platform] = await db
    .update(platforms)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(platforms.id, id))
    .returning();

  if (platform) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.PLATFORM_UPDATED,
      entityType: 'platform',
      entityId: platform.id,
      metadata: { name: platform.name },
    });
  }

  revalidatePath('/admin/platforms');
  revalidatePath(`/admin/platforms/${id}/edit`);
  revalidatePath('/platforms');
  revalidatePath('/');
  return { success: true, data: platform };
}

export async function archivePlatform(id: string) {
  const user = await requirePermission('platforms.delete');
  
  const [platform] = await db
    .update(platforms)
    .set({ status: 'temporarily_unavailable', updatedAt: new Date() })
    .where(eq(platforms.id, id))
    .returning();

  if (platform) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.PLATFORM_ARCHIVED,
      entityType: 'platform',
      entityId: platform.id,
      metadata: { name: platform.name },
    });
  }

  revalidatePath('/admin/platforms');
  revalidatePath('/platforms');
  revalidatePath('/');
  return { success: true, data: platform };
}

export async function deletePlatform(id: string) {
  const user = await requirePermission('platforms.delete');
  
  const [platform] = await db.delete(platforms).where(eq(platforms.id, id)).returning();

  if (platform) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.PLATFORM_DELETED,
      entityType: 'platform',
      entityId: platform.id,
      metadata: { name: platform.name },
    });
  }

  revalidatePath('/admin/platforms');
  revalidatePath('/platforms');
  revalidatePath('/');
  return { success: true, data: platform };
}

export async function togglePlatformFeatured(id: string) {
  const user = await requirePermission('platforms.edit');
  
  const [current] = await db.select({ featured: platforms.featured }).from(platforms).where(eq(platforms.id, id));
  
  if (!current) return { success: false, error: 'Platform not found' };

  const [platform] = await db
    .update(platforms)
    .set({ featured: !current.featured, updatedAt: new Date() })
    .where(eq(platforms.id, id))
    .returning();

  if (platform) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.PLATFORM_UPDATED,
      entityType: 'platform',
      entityId: platform.id,
      metadata: { name: platform.name, featured: platform.featured },
    });
  }

  revalidatePath('/admin/platforms');
  revalidatePath('/platforms');
  revalidatePath('/');
  return { success: true, data: platform };
}