'use server';

import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { createAuditLog } from './audit';

export async function updateContactStatus(id: string, status: 'new' | 'read' | 'replied' | 'archived') {
  const user = await requirePermission('contact.view');
  
  await db
    .update(contactSubmissions)
    .set({ status, updatedAt: new Date() })
    .where(eq(contactSubmissions.id, id));

  await createAuditLog({
    userId: user.id,
    action: 'contact.status_updated',
    entityType: 'contact_submission',
    entityId: id,
    metadata: { newStatus: status },
  });

  revalidatePath('/admin/contact');
  return { success: true };
}

export async function deleteContactSubmission(id: string) {
  const user = await requirePermission('contact.delete');
  
  await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));

  await createAuditLog({
    userId: user.id,
    action: 'contact.deleted',
    entityType: 'contact_submission',
    entityId: id,
  });

  revalidatePath('/admin/contact');
  return { success: true };
}
