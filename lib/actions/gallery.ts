'use server';

import { db } from '@/lib/db';
import { galleryItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { createAuditLog } from './audit';
import { z } from 'zod';

const optionalStringSchema = (maxLen = 500) => z.preprocess((arg) => {
  if (typeof arg === 'string' && (arg.trim() === '' || arg === 'null' || arg === 'undefined')) {
    return null;
  }
  return arg;
}, z.string().max(maxLen).nullable().optional().or(z.literal('')));

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

const statusSchema = z.preprocess((arg) => {
  if (arg === 'active') return 'published';
  if (arg === 'inactive') return 'draft';
  if (typeof arg === 'string' && arg.trim()) return arg;
  return 'published';
}, z.enum(['draft', 'published', 'archived']).default('published'));

const mediaTypeSchema = z.preprocess((arg) => {
  if (typeof arg === 'string' && ['image', 'video', 'link'].includes(arg.toLowerCase())) {
    return arg.toLowerCase();
  }
  return 'image';
}, z.enum(['image', 'video', 'link']).default('image'));

const galleryItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: optionalStringSchema(3000),
  mediaType: mediaTypeSchema,
  mediaUrl: z.string().min(1, 'Media URL is required').max(2000),
  thumbnailUrl: optionalStringSchema(2000),
  category: optionalStringSchema(100),
  eventDate: optionalDateSchema,
  location: optionalStringSchema(200),
  externalLink: optionalStringSchema(2000),
  featured: z.preprocess((v) => v === 'true' || v === 'on' || v === true, z.boolean()).default(false),
  displayOrder: z.coerce.number().int().min(0).default(0),
  status: statusSchema,
});

export async function createGalleryItem(formData: FormData) {
  const user = await requirePermission('gallery.create');
  const raw = Object.fromEntries(formData);
  const parsed = galleryItemSchema.safeParse(raw);

  if (!parsed.success) {
    console.error('[createGalleryItem] Validation error:', parsed.error.flatten());
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  const [item] = await db.insert(galleryItems).values({
    ...data,
    category: data.category || 'Events',
    eventDate: data.eventDate ? new Date(data.eventDate) : null,
  }).returning();

  if (item) {
    await createAuditLog({
      userId: user.id,
      action: 'gallery.created',
      entityType: 'gallery_item',
      entityId: item.id,
      metadata: { title: item.title, mediaType: item.mediaType, status: item.status },
    });
  }

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  revalidatePath('/');
  return { success: true, data: item };
}

export async function updateGalleryItem(id: string, formData: FormData) {
  const user = await requirePermission('gallery.edit');
  const raw = Object.fromEntries(formData);
  const parsed = galleryItemSchema.partial().safeParse(raw);

  if (!parsed.success) {
    console.error('[updateGalleryItem] Validation error:', parsed.error.flatten());
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  const [updated] = await db
    .update(galleryItems)
    .set({
      ...data,
      eventDate: data.eventDate !== undefined ? (data.eventDate ? new Date(data.eventDate) : null) : undefined,
      updatedAt: new Date(),
    })
    .where(eq(galleryItems.id, id))
    .returning();

  if (updated) {
    await createAuditLog({
      userId: user.id,
      action: 'gallery.updated',
      entityType: 'gallery_item',
      entityId: id,
      metadata: { title: updated.title, mediaType: updated.mediaType, status: updated.status },
    });
  }

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  revalidatePath('/');
  return { success: true, data: updated };
}

export async function toggleGalleryStatus(id: string, published: boolean) {
  const user = await requirePermission('gallery.edit');

  const [updated] = await db
    .update(galleryItems)
    .set({
      status: published ? 'published' : 'draft',
      updatedAt: new Date(),
    })
    .where(eq(galleryItems.id, id))
    .returning();

  if (updated) {
    await createAuditLog({
      userId: user.id,
      action: 'gallery.updated',
      entityType: 'gallery_item',
      entityId: id,
      metadata: { title: updated.title, status: updated.status },
    });
  }

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  revalidatePath('/');
  return { success: true, data: updated };
}

export async function deleteGalleryItem(id: string) {
  const user = await requirePermission('gallery.delete');
  const [deleted] = await db.delete(galleryItems).where(eq(galleryItems.id, id)).returning();

  if (deleted) {
    await createAuditLog({
      userId: user.id,
      action: 'gallery.deleted',
      entityType: 'gallery_item',
      entityId: id,
      metadata: { title: deleted.title, action: 'permanent_delete' },
    });
  }

  revalidatePath('/admin/gallery');
  revalidatePath('/gallery');
  revalidatePath('/');
  return { success: true, data: deleted };
}