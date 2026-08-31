'use server';

import { db } from '@/lib/db';
import { getInvolvedLinks } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { createAuditLog } from './audit';
import { z } from 'zod';

const getInvolvedSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().max(1000).optional().nullable(),
  icon: z.string().max(50).optional().nullable(),
  url: z.string().max(2000).optional().nullable(),
  urlType: z.enum(['external', 'internal', 'google_form']).default('external'),
  displayOrder: z.coerce.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
});

export async function createGetInvolvedLink(formData: FormData) {
  const user = await requirePermission('get-involved.create');
  const raw = Object.fromEntries(formData);
  const parsed = getInvolvedSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.flatten().fieldErrors };

  const [link] = await db.insert(getInvolvedLinks).values(parsed.data).returning();
  await createAuditLog({ userId: user.id, action: 'get_involved.created', entityType: 'get_involved_link', entityId: link.id });
  revalidatePath('/admin/get-involved');
  revalidatePath('/');
  revalidatePath('/get-involved');
  return { success: true, data: link };
}

export async function updateGetInvolvedLink(id: string, formData: FormData) {
  const user = await requirePermission('get-involved.edit');
  const raw = Object.fromEntries(formData);
  const parsed = getInvolvedSchema.partial().safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.flatten().fieldErrors };

  const [updated] = await db.update(getInvolvedLinks).set({ ...parsed.data, updatedAt: new Date() }).where(eq(getInvolvedLinks.id, id)).returning();
  await createAuditLog({ userId: user.id, action: 'get_involved.updated', entityType: 'get_involved_link', entityId: id });
  revalidatePath('/admin/get-involved');
  revalidatePath('/');
  revalidatePath('/get-involved');
  return { success: true, data: updated };
}

export async function deleteGetInvolvedLink(id: string) {
  const user = await requirePermission('get-involved.delete');
  await db.delete(getInvolvedLinks).where(eq(getInvolvedLinks.id, id));
  await createAuditLog({ userId: user.id, action: 'get_involved.deleted', entityType: 'get_involved_link', entityId: id });
  revalidatePath('/admin/get-involved');
  revalidatePath('/');
  revalidatePath('/get-involved');
  return { success: true };
}
