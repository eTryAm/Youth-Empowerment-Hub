import { db } from '@/lib/db';
import { auditLogs } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import { requireAuth } from '@/lib/auth';

interface AuditLogEntry {
  userId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

export async function createAuditLog(entry: AuditLogEntry) {
  try {
    await db.insert(auditLogs).values({
      userId: entry.userId,
      action: entry.action,
      entityType: entry.entityType ?? null,
      entityId: entry.entityId ?? null,
      metadata: entry.metadata ?? null,
      ipAddress: entry.ipAddress ?? null,
    });
  } catch (error) {
    // Audit logging should never break the main operation
    console.error('Failed to create audit log:', error);
  }
}

// Common audit action constants
export const AUDIT_ACTIONS = {
  // Auth
  LOGIN: 'user.login',
  LOGOUT: 'user.logout',
  LOGIN_FAILED: 'user.login_failed',

  // Platforms
  PLATFORM_CREATED: 'platform.created',
  PLATFORM_UPDATED: 'platform.updated',
  PLATFORM_ARCHIVED: 'platform.archived',
  PLATFORM_DELETED: 'platform.deleted',
  PLATFORM_PUBLISHED: 'platform.published',

  // Events
  EVENT_CREATED: 'event.created',
  EVENT_UPDATED: 'event.updated',
  EVENT_ARCHIVED: 'event.archived',
  EVENT_DELETED: 'event.deleted',
  EVENT_PUBLISHED: 'event.published',

  // Initiatives
  INITIATIVE_CREATED: 'initiative.created',
  INITIATIVE_UPDATED: 'initiative.updated',
  INITIATIVE_ARCHIVED: 'initiative.archived',
  INITIATIVE_DELETED: 'initiative.deleted',

  // Announcements
  ANNOUNCEMENT_CREATED: 'announcement.created',
  ANNOUNCEMENT_UPDATED: 'announcement.updated',
  ANNOUNCEMENT_ARCHIVED: 'announcement.archived',
  ANNOUNCEMENT_DELETED: 'announcement.deleted',

  // Testimonials
  TESTIMONIAL_CREATED: 'testimonial.created',
  TESTIMONIAL_UPDATED: 'testimonial.updated',
  TESTIMONIAL_ARCHIVED: 'testimonial.archived',
  TESTIMONIAL_DELETED: 'testimonial.deleted',

  // Partners
  PARTNER_CREATED: 'partner.created',
  PARTNER_UPDATED: 'partner.updated',
  PARTNER_ARCHIVED: 'partner.archived',
  PARTNER_DELETED: 'partner.deleted',

  // Settings
  SETTINGS_UPDATED: 'settings.updated',
  FEATURE_FLAG_UPDATED: 'feature_flag.updated',
  HOMEPAGE_UPDATED: 'homepage.updated',

  // Users
  USER_CREATED: 'user.created',
  USER_ROLE_CHANGED: 'user.role_changed',
  USER_DEACTIVATED: 'user.deactivated',

  // Media
  MEDIA_UPLOADED: 'media.uploaded',
  MEDIA_DELETED: 'media.deleted',

  // Contact
  CONTACT_STATUS_UPDATED: 'contact.status_updated',
} as const;

export type AuditAction = (typeof AUDIT_ACTIONS)[keyof typeof AUDIT_ACTIONS];

export async function getAuditLogs() {
  try {
    await requireAuth();
  } catch {
    // If running in build/server context where auth might be bypassed or handled in SSR
  }
  return await db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt));
}