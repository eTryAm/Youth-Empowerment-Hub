'use server';

import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { createAuditLog, AUDIT_ACTIONS } from './audit';
import { z } from 'zod';

const optionalDateSchema = z.preprocess((arg) => {
  if (typeof arg === 'string' && (arg.trim() === '' || arg === 'null' || arg === 'undefined')) {
    return null;
  }
  if (arg instanceof Date) return arg;
  if (typeof arg === 'string' || typeof arg === 'number') {
    const d = new Date(arg);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}, z.date().nullable().optional());

const optionalUrlSchema = z.preprocess((arg) => {
  if (typeof arg === 'string' && (arg.trim() === '' || arg === 'null' || arg === 'undefined')) {
    return null;
  }
  return arg;
}, z.string().url('Must be a valid URL').nullable().optional().or(z.literal('')));

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

const announcementSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.preprocess((arg) => typeof arg === 'string' && arg.trim() === '' ? null : arg, z.string().max(5000).nullable().optional()),
  date: optionalDateSchema,
  imageUrl: optionalStringSchema(1000),
  externalUrl: optionalUrlSchema,
  category: optionalStringSchema(50),
  featured: z.preprocess((v) => v === 'true' || v === 'on' || v === true, z.boolean()).default(false),
  status: statusSchema,
});

export async function createAnnouncement(formData: FormData) {
  const user = await requirePermission('announcements.create');
  const raw = Object.fromEntries(formData);
  const parsed = announcementSchema.safeParse(raw);

  if (!parsed.success) {
    console.error('[createAnnouncement] Validation failed:', parsed.error.flatten());
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  const [announcement] = await db.insert(announcements).values({
    ...data,
    date: data.date ? new Date(data.date) : new Date(),
  }).returning();

  if (announcement) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.ANNOUNCEMENT_CREATED,
      entityType: 'announcement',
      entityId: announcement.id,
      metadata: { title: announcement.title, status: announcement.status, featured: announcement.featured },
    });
  }

  revalidatePath('/admin/announcements');
  revalidatePath('/');
  return { success: true, data: announcement };
}

export async function updateAnnouncement(id: string, formData: FormData) {
  const user = await requirePermission('announcements.edit');
  const raw = Object.fromEntries(formData);
  const parsed = announcementSchema.partial().safeParse(raw);

  if (!parsed.success) {
    console.error('[updateAnnouncement] Validation failed:', parsed.error.flatten());
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  const [updated] = await db
    .update(announcements)
    .set({
      ...data,
      date: data.date !== undefined ? (data.date ? new Date(data.date) : null) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(announcements.id, id))
    .returning();

  if (updated) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.ANNOUNCEMENT_UPDATED,
      entityType: 'announcement',
      entityId: id,
      metadata: { title: updated.title, status: updated.status, featured: updated.featured },
    });
  }

  revalidatePath('/admin/announcements');
  revalidatePath('/');
  return { success: true, data: updated };
}

export async function archiveAnnouncement(id: string) {
  const user = await requirePermission('announcements.delete');

  const [updated] = await db
    .update(announcements)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(eq(announcements.id, id))
    .returning();

  if (updated) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.ANNOUNCEMENT_ARCHIVED,
      entityType: 'announcement',
      entityId: id,
      metadata: { title: updated.title },
    });
  }

  revalidatePath('/admin/announcements');
  revalidatePath('/');
  return { success: true, data: updated };
}

export async function deleteAnnouncement(id: string) {
  const user = await requirePermission('announcements.delete');
  const [deleted] = await db.delete(announcements).where(eq(announcements.id, id)).returning();

  if (deleted) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.ANNOUNCEMENT_ARCHIVED,
      entityType: 'announcement',
      entityId: id,
      metadata: { title: deleted.title, action: 'permanent_delete' },
    });
  }

  revalidatePath('/admin/announcements');
  revalidatePath('/');
  return { success: true, data: deleted };
}