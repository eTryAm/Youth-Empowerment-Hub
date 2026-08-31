'use server';

import { db } from '@/lib/db';
import { objectives } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { createAuditLog } from './audit';
import { z } from 'zod';

const objectiveSchema = z.object({
  text: z.string().min(1, 'Objective text is required').max(1000),
  category: z.string().min(1, 'Category is required').max(50),
  icon: z.string().max(50).optional().nullable(),
  displayOrder: z.coerce.number().int().min(0).default(0),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
});

export async function createObjective(formData: FormData) {
  const user = await requirePermission('objectives.create');
  const raw = Object.fromEntries(formData);
  const parsed = objectiveSchema.safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.flatten().fieldErrors };

  const [objective] = await db.insert(objectives).values(parsed.data).returning();
  await createAuditLog({ userId: user.id, action: 'objective.created', entityType: 'objective', entityId: objective.id });
  revalidatePath('/admin/objectives');
  revalidatePath('/');
  revalidatePath('/about');
  return { success: true, data: objective };
}

export async function updateObjective(id: string, formData: FormData) {
  const user = await requirePermission('objectives.edit');
  const raw = Object.fromEntries(formData);
  const parsed = objectiveSchema.partial().safeParse(raw);
  if (!parsed.success) return { success: false, error: parsed.error.flatten().fieldErrors };

  const [updated] = await db.update(objectives).set({ ...parsed.data, updatedAt: new Date() }).where(eq(objectives.id, id)).returning();
  await createAuditLog({ userId: user.id, action: 'objective.updated', entityType: 'objective', entityId: id });
  revalidatePath('/admin/objectives');
  revalidatePath('/');
  revalidatePath('/about');
  return { success: true, data: updated };
}

export async function deleteObjective(id: string) {
  const user = await requirePermission('objectives.delete');
  await db.delete(objectives).where(eq(objectives.id, id));
  await createAuditLog({ userId: user.id, action: 'objective.deleted', entityType: 'objective', entityId: id });
  revalidatePath('/admin/objectives');
  revalidatePath('/');
  revalidatePath('/about');
  return { success: true };
}
