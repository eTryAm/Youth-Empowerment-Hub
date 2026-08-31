'use server';

import { db } from '@/lib/db';
import { impactMetrics } from '@/lib/db/schema';
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

const statusSchema = z.preprocess((arg) => {
  if (arg === 'active') return 'published';
  if (arg === 'inactive') return 'draft';
  if (typeof arg === 'string' && arg.trim()) return arg;
  return 'published';
}, z.enum(['draft', 'published', 'archived']).default('published'));

const impactSchema = z.object({
  label: z.string().min(1, 'Label is required').max(100),
  value: optionalStringSchema(50),
  description: optionalStringSchema(1000),
  icon: optionalStringSchema(50),
  displayOrder: z.coerce.number().int().min(0).default(0),
  status: statusSchema,
});

export async function createImpactMetric(formData: FormData) {
  const user = await requirePermission('impact.create');
  const raw = Object.fromEntries(formData);
  const parsed = impactSchema.safeParse(raw);

  if (!parsed.success) {
    console.error('[createImpactMetric] Validation failed:', parsed.error.flatten());
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const [metric] = await db.insert(impactMetrics).values(parsed.data).returning();

  if (metric) {
    await createAuditLog({
      userId: user.id,
      action: 'impact.created',
      entityType: 'impact_metric',
      entityId: metric.id,
      metadata: { label: metric.label, value: metric.value, status: metric.status },
    });
  }

  revalidatePath('/admin/impact');
  revalidatePath('/impact');
  revalidatePath('/');
  return { success: true, data: metric };
}

export async function updateImpactMetric(id: string, formData: FormData) {
  const user = await requirePermission('impact.edit');
  const raw = Object.fromEntries(formData);
  const parsed = impactSchema.partial().safeParse(raw);

  if (!parsed.success) {
    console.error('[updateImpactMetric] Validation failed:', parsed.error.flatten());
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const [updated] = await db
    .update(impactMetrics)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(impactMetrics.id, id))
    .returning();

  if (updated) {
    await createAuditLog({
      userId: user.id,
      action: 'impact.updated',
      entityType: 'impact_metric',
      entityId: id,
      metadata: { label: updated.label, value: updated.value, status: updated.status },
    });
  }

  revalidatePath('/admin/impact');
  revalidatePath('/impact');
  revalidatePath('/');
  return { success: true, data: updated };
}

export async function deleteImpactMetric(id: string) {
  const user = await requirePermission('impact.delete');
  const [deleted] = await db.delete(impactMetrics).where(eq(impactMetrics.id, id)).returning();

  if (deleted) {
    await createAuditLog({
      userId: user.id,
      action: 'impact.deleted',
      entityType: 'impact_metric',
      entityId: id,
      metadata: { label: deleted.label },
    });
  }

  revalidatePath('/admin/impact');
  revalidatePath('/impact');
  revalidatePath('/');
  return { success: true, data: deleted };
}