'use server';

import { db } from '@/lib/db';
import { initiatives } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { createAuditLog, AUDIT_ACTIONS } from './audit';
import { z } from 'zod';

const optionalStringSchema = (maxLen = 200) => z.preprocess((arg) => {
  if (typeof arg === 'string' && (arg.trim() === '' || arg === 'null' || arg === 'undefined')) {
    return null;
  }
  return arg;
}, z.string().max(maxLen).nullable().optional().or(z.literal('')));

const optionalUrlSchema = z.preprocess((arg) => {
  if (typeof arg === 'string' && (arg.trim() === '' || arg === 'null' || arg === 'undefined')) {
    return null;
  }
  return arg;
}, z.string().url('Must be a valid URL').nullable().optional().or(z.literal('')));

const statusSchema = z.preprocess((arg) => {
  if (arg === 'active') return 'published';
  if (arg === 'inactive') return 'draft';
  if (typeof arg === 'string' && arg.trim()) return arg;
  return 'published';
}, z.enum(['draft', 'published', 'archived']).default('published'));

const initiativeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.preprocess((arg) => typeof arg === 'string' && arg.trim() === '' ? null : arg, z.string().max(5000).nullable().optional()),
  icon: optionalStringSchema(50),
  imageUrl: optionalStringSchema(1000),
  category: optionalStringSchema(50),
  status: statusSchema,
  ctaText: optionalStringSchema(50),
  ctaUrl: optionalUrlSchema,
  displayOrder: z.coerce.number().int().min(0).default(0),
});

export async function createInitiative(formData: FormData) {
  const user = await requirePermission('initiatives.create');
  const raw = Object.fromEntries(formData);
  const parsed = initiativeSchema.safeParse(raw);

  if (!parsed.success) {
    console.error('[createInitiative] Validation failed:', parsed.error.flatten());
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const [initiative] = await db.insert(initiatives).values(parsed.data).returning();

  if (initiative) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.INITIATIVE_CREATED,
      entityType: 'initiative',
      entityId: initiative.id,
      metadata: { title: initiative.title, status: initiative.status },
    });
  }

  revalidatePath('/admin/initiatives');
  revalidatePath('/');
  revalidatePath('/initiatives');
  return { success: true, data: initiative };
}

export async function updateInitiative(id: string, formData: FormData) {
  const user = await requirePermission('initiatives.edit');
  const raw = Object.fromEntries(formData);
  const parsed = initiativeSchema.partial().safeParse(raw);

  if (!parsed.success) {
    console.error('[updateInitiative] Validation failed:', parsed.error.flatten());
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const [updated] = await db
    .update(initiatives)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(initiatives.id, id))
    .returning();

  if (updated) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.INITIATIVE_UPDATED,
      entityType: 'initiative',
      entityId: id,
      metadata: { title: updated.title, status: updated.status },
    });
  }

  revalidatePath('/admin/initiatives');
  revalidatePath('/');
  revalidatePath('/initiatives');
  return { success: true, data: updated };
}

export async function archiveInitiative(id: string) {
  const user = await requirePermission('initiatives.delete');

  const [updated] = await db
    .update(initiatives)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(eq(initiatives.id, id))
    .returning();

  if (updated) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.INITIATIVE_ARCHIVED,
      entityType: 'initiative',
      entityId: id,
      metadata: { title: updated.title },
    });
  }

  revalidatePath('/admin/initiatives');
  revalidatePath('/');
  revalidatePath('/initiatives');
  return { success: true, data: updated };
}

export async function deleteInitiative(id: string) {
  const user = await requirePermission('initiatives.delete');

  const [deleted] = await db.delete(initiatives).where(eq(initiatives.id, id)).returning();

  if (deleted) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.INITIATIVE_ARCHIVED,
      entityType: 'initiative',
      entityId: id,
      metadata: { title: deleted.title, action: 'permanent_delete' },
    });
  }

  revalidatePath('/admin/initiatives');
  revalidatePath('/');
  revalidatePath('/initiatives');
  return { success: true, data: deleted };
}