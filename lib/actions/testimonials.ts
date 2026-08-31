'use server';

import { db } from '@/lib/db';
import { testimonials } from '@/lib/db/schema';
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

const adminTestimonialSchema = z.object({
  personName: z.string().min(1, 'Name is required').max(100),
  designation: optionalStringSchema(100),
  organization: optionalStringSchema(200),
  photoUrl: optionalStringSchema(1000),
  testimonialText: z.string().min(10, 'Testimonial must be at least 10 characters').max(3000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  featured: z.preprocess((v) => v === 'true' || v === 'on' || v === true, z.boolean()).default(false),
  status: statusSchema,
});

const publicSubmissionSchema = z.object({
  personName: z.string().min(2, 'Please enter your full name').max(100),
  designation: optionalStringSchema(100),
  organization: optionalStringSchema(200),
  photoUrl: optionalStringSchema(1000),
  testimonialText: z.string().min(15, 'Please share a bit more detail about your experience (minimum 15 characters)').max(3000),
  rating: z.coerce.number().int().min(1).max(5).default(5),
});

/**
 * Publicly accessible submission for "Share Your Experience".
 * Always saves as "draft" (pending review) for admin approval.
 */
export async function submitPublicTestimonial(formData: FormData) {
  try {
    const raw = Object.fromEntries(formData);
    const parsed = publicSubmissionSchema.safeParse(raw);

    if (!parsed.success) {
      return { success: false, error: parsed.error.flatten().fieldErrors };
    }

    const [testimonial] = await db.insert(testimonials).values({
      personName: parsed.data.personName,
      designation: parsed.data.designation ?? null,
      organization: parsed.data.organization ?? null,
      photoUrl: parsed.data.photoUrl ?? null,
      testimonialText: parsed.data.testimonialText,
      rating: parsed.data.rating ?? 5,
      featured: false,
      status: 'draft', // Requires admin approval to be published
    }).returning();

    revalidatePath('/admin/testimonials');
    return {
      success: true,
      message: 'Thank you! Your experience and rating have been submitted and will appear on the site once reviewed by our team.',
      data: testimonial,
    };
  } catch (error) {
    console.error('[submitPublicTestimonial]', error);
    return { success: false, error: 'Failed to submit testimonial. Please try again.' };
  }
}

/**
 * 1-Click Approve / Publish Toggle for Admins
 */
export async function approveTestimonial(id: string, published: boolean) {
  const user = await requirePermission('testimonials.edit');

  const [updated] = await db
    .update(testimonials)
    .set({
      status: published ? 'published' : 'draft',
      updatedAt: new Date(),
    })
    .where(eq(testimonials.id, id))
    .returning();

  if (updated) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.TESTIMONIAL_UPDATED,
      entityType: 'testimonial',
      entityId: id,
      metadata: { name: updated.personName, status: updated.status },
    });
  }

  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  return { success: true, data: updated };
}

export async function createTestimonial(formData: FormData) {
  const user = await requirePermission('testimonials.create');
  const raw = Object.fromEntries(formData);
  const parsed = adminTestimonialSchema.safeParse(raw);

  if (!parsed.success) {
    console.error('[createTestimonial] Validation failed:', parsed.error.flatten());
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const [testimonial] = await db.insert(testimonials).values(parsed.data).returning();

  if (testimonial) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.TESTIMONIAL_CREATED,
      entityType: 'testimonial',
      entityId: testimonial.id,
      metadata: { name: testimonial.personName, status: testimonial.status, rating: testimonial.rating },
    });
  }

  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  return { success: true, data: testimonial };
}

export async function updateTestimonial(id: string, formData: FormData) {
  const user = await requirePermission('testimonials.edit');
  const raw = Object.fromEntries(formData);
  const parsed = adminTestimonialSchema.partial().safeParse(raw);

  if (!parsed.success) {
    console.error('[updateTestimonial] Validation failed:', parsed.error.flatten());
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const [updated] = await db
    .update(testimonials)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(testimonials.id, id))
    .returning();

  if (updated) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.TESTIMONIAL_UPDATED,
      entityType: 'testimonial',
      entityId: id,
      metadata: { name: updated.personName, status: updated.status, rating: updated.rating },
    });
  }

  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  return { success: true, data: updated };
}

export async function archiveTestimonial(id: string) {
  const user = await requirePermission('testimonials.delete');

  const [updated] = await db
    .update(testimonials)
    .set({ status: 'archived', updatedAt: new Date() })
    .where(eq(testimonials.id, id))
    .returning();

  if (updated) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.TESTIMONIAL_ARCHIVED,
      entityType: 'testimonial',
      entityId: id,
      metadata: { name: updated.personName },
    });
  }

  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  return { success: true, data: updated };
}

export async function deleteTestimonial(id: string) {
  const user = await requirePermission('testimonials.delete');
  const [deleted] = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();

  if (deleted) {
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.TESTIMONIAL_ARCHIVED,
      entityType: 'testimonial',
      entityId: id,
      metadata: { name: deleted.personName, action: 'permanent_delete' },
    });
  }

  revalidatePath('/admin/testimonials');
  revalidatePath('/');
  return { success: true, data: deleted };
}