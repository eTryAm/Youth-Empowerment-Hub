'use server';

import { db } from '@/lib/db';
import { events } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { createEventSchema, updateEventSchema } from '@/lib/validators/event';
import { createAuditLog, AUDIT_ACTIONS } from './audit';

export async function createEvent(formData: FormData) {
  const user = await requirePermission('events.create');
  
  const raw: Record<string, any> = Object.fromEntries(formData);
  // Parse booleans
  raw.featured = raw.featured === 'on' || raw.featured === 'true' || raw.featured === true;
  raw.requiresRegistration = raw.requiresRegistration === 'on' || raw.requiresRegistration === 'true' || raw.requiresRegistration === true;
  
  const parsed = createEventSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('[createEvent] Validation failed:', parsed.error.flatten());
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  const [event] = await db.insert(events).values({
    ...data,
    date: data.date ? new Date(data.date) : null,
    endDate: data.endDate ? new Date(data.endDate) : null,
  }).returning();

  if (event) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.EVENT_CREATED,
      entityType: 'event',
      entityId: event.id,
      metadata: { title: event.title, status: event.status },
    });
  }

  revalidatePath('/admin/events');
  revalidatePath('/events');
  revalidatePath('/');
  return { success: true, data: event };
}

export async function updateEvent(id: string, formData: FormData) {
  const user = await requirePermission('events.edit');
  
  const raw: Record<string, any> = Object.fromEntries(formData);
  raw.id = id;
  // Parse booleans
  raw.featured = raw.featured === 'on' || raw.featured === 'true' || raw.featured === true;
  raw.requiresRegistration = raw.requiresRegistration === 'on' || raw.requiresRegistration === 'true' || raw.requiresRegistration === true;
  
  const parsed = updateEventSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('[updateEvent] Validation failed:', parsed.error.flatten());
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const data = parsed.data;

  const [event] = await db
    .update(events)
    .set({
      ...data,
      date: data.date ? new Date(data.date) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      updatedAt: new Date(),
    })
    .where(eq(events.id, id))
    .returning();

  if (event) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.EVENT_UPDATED,
      entityType: 'event',
      entityId: event.id,
      metadata: { title: event.title, status: event.status },
    });
  }

  revalidatePath('/admin/events');
  revalidatePath(`/admin/events/${id}/edit`);
  revalidatePath('/events');
  revalidatePath('/');
  return { success: true, data: event };
}

export async function archiveEvent(id: string) {
  const user = await requirePermission('events.delete');
  
  const [event] = await db
    .update(events)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning();

  if (event) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.EVENT_ARCHIVED,
      entityType: 'event',
      entityId: event.id,
      metadata: { title: event.title },
    });
  }

  revalidatePath('/admin/events');
  revalidatePath('/events');
  revalidatePath('/');
  return { success: true, data: event };
}

export async function deleteEvent(id: string) {
  const user = await requirePermission('events.delete');
  
  const [event] = await db.delete(events).where(eq(events.id, id)).returning();

  if (event) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.EVENT_DELETED,
      entityType: 'event',
      entityId: event.id,
      metadata: { title: event.title },
    });
  }

  revalidatePath('/admin/events');
  revalidatePath('/events');
  revalidatePath('/');
  return { success: true, data: event };
}

export async function toggleEventFeatured(id: string) {
  const user = await requirePermission('events.edit');
  
  const [current] = await db.select({ featured: events.featured }).from(events).where(eq(events.id, id));
  
  if (!current) return { success: false, error: 'Event not found' };

  const [event] = await db
    .update(events)
    .set({ featured: !current.featured, updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning();

  if (event) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.EVENT_UPDATED,
      entityType: 'event',
      entityId: event.id,
      metadata: { title: event.title, featured: event.featured },
    });
  }

  revalidatePath('/admin/events');
  revalidatePath('/events');
  revalidatePath('/');
  return { success: true, data: event };
}