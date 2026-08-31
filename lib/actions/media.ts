'use server';

import { db } from '@/lib/db';
import { media } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { createAuditLog, AUDIT_ACTIONS } from './audit';
import { supabaseAdmin } from '@/lib/supabase/admin';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function uploadMedia(formData: FormData) {
  const user = await requirePermission('media.upload');
  const file = formData.get('file') as File;

  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { success: false, error: `File type "${file.type}" is not allowed. Allowed: ${ALLOWED_MIME_TYPES.join(', ')}` };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: 'File size exceeds 10MB limit' };
  }

  // Sanitize filename
  const sanitizedName = file.name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .toLowerCase();
  const timestamp = Date.now();
  const filename = `${timestamp}_${sanitizedName}`;
  const filePath = `uploads/${filename}`;

  // Upload to Supabase Storage
  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from('media')
    .upload(filePath, file, {
      contentType: file.type,
      cacheControl: '3600',
    });

  if (uploadError) {
    return { success: false, error: `Upload failed: ${uploadError.message}` };
  }

  // Get public URL
  const { data: urlData } = supabaseAdmin.storage
    .from('media')
    .getPublicUrl(uploadData.path);

  // Save to database
  const [mediaRecord] = await db.insert(media).values({
    filename,
    originalName: file.name,
    url: urlData.publicUrl,
    fileType: file.type.startsWith('image/') ? 'image' : 'document',
    mimeType: file.type,
    size: file.size,
    altText: formData.get('altText') as string || null,
    uploadedBy: user.id,
  }).returning();

  await createAuditLog({
    userId: user.id,
    action: AUDIT_ACTIONS.MEDIA_UPLOADED,
    entityType: 'media',
    entityId: mediaRecord.id,
    metadata: { filename, type: file.type, size: file.size },
  });

  revalidatePath('/admin/media');
  return { success: true, data: mediaRecord };
}

export async function deleteMedia(id: string) {
  const user = await requirePermission('media.delete');

  // Get the media record
  const [record] = await db.select().from(media).where(eq(media.id, id)).limit(1);
  if (!record) {
    return { success: false, error: 'Media not found' };
  }

  // Delete from Supabase Storage
  const filePath = `uploads/${record.filename}`;
  const { error: deleteError } = await supabaseAdmin.storage
    .from('media')
    .remove([filePath]);

  if (deleteError) {
    console.error('Failed to delete from storage:', deleteError);
  }

  // Delete from database
  await db.delete(media).where(eq(media.id, id));

  await createAuditLog({
    userId: user.id,
    action: AUDIT_ACTIONS.MEDIA_DELETED,
    entityType: 'media',
    entityId: id,
    metadata: { filename: record.filename },
  });

  revalidatePath('/admin/media');
  return { success: true };
}

export async function getMediaList(page = 1, pageSize = 20) {
  await requirePermission('media.view');

  const offset = (page - 1) * pageSize;
  const items = await db
    .select()
    .from(media)
    .orderBy(desc(media.createdAt))
    .limit(pageSize)
    .offset(offset);

  return items;
}
