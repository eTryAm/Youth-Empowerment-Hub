'use server';

import { db } from '@/lib/db';
import { partners } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { createAuditLog, AUDIT_ACTIONS } from './audit';
import { z } from 'zod';

const partnerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  logoUrl: z.string().optional().nullable(),
  website: z.string().url().optional().nullable().or(z.literal('')),
  description: z.string().max(2000).optional().nullable(),
  partnershipType: z.string().max(50).optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

export async function createPartner(formData: FormData) {
  const user = await requirePermission('partners.create');
  const raw = Object.fromEntries(formData);
  const parsed = partnerSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const [partner] = await db.insert(partners).values(parsed.data).returning();

  await createAuditLog({
    userId: user.id,
    action: AUDIT_ACTIONS.PARTNER_CREATED,
    entityType: 'partner',
    entityId: partner.id,
    metadata: { name: partner.name },
  });

  revalidatePath('/admin/partners');
  revalidatePath('/');
  return { success: true, data: partner };
}

export async function updatePartner(id: string, formData: FormData) {
  const user = await requirePermission('partners.edit');
  const raw = Object.fromEntries(formData);
  const parsed = partnerSchema.partial().safeParse(raw);

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const [updated] = await db
    .update(partners)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(partners.id, id))
    .returning();

  await createAuditLog({
    userId: user.id,
    action: AUDIT_ACTIONS.PARTNER_UPDATED,
    entityType: 'partner',
    entityId: id,
    metadata: { name: updated?.name },
  });

  revalidatePath('/admin/partners');
  revalidatePath('/');
  return { success: true, data: updated };
}

export async function archivePartner(id: string) {
  const user = await requirePermission('partners.delete');

  await db
    .update(partners)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(eq(partners.id, id));

  await createAuditLog({
    userId: user.id,
    action: AUDIT_ACTIONS.PARTNER_ARCHIVED,
    entityType: 'partner',
    entityId: id,
  });

  revalidatePath('/admin/partners');
  revalidatePath('/');
  return { success: true };
}

export async function deletePartner(id: string) {
  const user = await requirePermission('partners.delete');
  await db.delete(partners).where(eq(partners.id, id));

  await createAuditLog({
    userId: user.id,
    action: AUDIT_ACTIONS.PARTNER_ARCHIVED,
    entityType: 'partner',
    entityId: id,
    metadata: { action: 'permanent_delete' },
  });

  revalidatePath('/admin/partners');
  revalidatePath('/');
  return { success: true };
}
