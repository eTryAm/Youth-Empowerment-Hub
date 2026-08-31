export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  CONTENT_ADMIN: 'content_admin',
  VIEWER: 'viewer',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const PERMISSIONS = {
  // Platform management
  'platforms.create': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'platforms.edit': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'platforms.delete': [ROLES.SUPER_ADMIN],
  'platforms.view': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN, ROLES.VIEWER],
  // Event management
  'events.create': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'events.edit': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'events.delete': [ROLES.SUPER_ADMIN],
  'events.view': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN, ROLES.VIEWER],
  // Initiative management
  'initiatives.create': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'initiatives.edit': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'initiatives.delete': [ROLES.SUPER_ADMIN],
  'initiatives.view': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN, ROLES.VIEWER],
  // Objective management
  'objectives.create': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'objectives.edit': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'objectives.delete': [ROLES.SUPER_ADMIN],
  'objectives.view': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN, ROLES.VIEWER],
  // Announcement management
  'announcements.create': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'announcements.edit': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'announcements.delete': [ROLES.SUPER_ADMIN],
  'announcements.view': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN, ROLES.VIEWER],
  // Testimonial management
  'testimonials.create': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'testimonials.edit': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'testimonials.delete': [ROLES.SUPER_ADMIN],
  'testimonials.view': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN, ROLES.VIEWER],
  // Partner management
  'partners.create': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'partners.edit': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'partners.delete': [ROLES.SUPER_ADMIN],
  'partners.view': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN, ROLES.VIEWER],
  // Impact metrics
  'impact.create': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'impact.edit': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'impact.delete': [ROLES.SUPER_ADMIN],
  'impact.view': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN, ROLES.VIEWER],
  // Get involved links
  'get-involved.create': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'get-involved.edit': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'get-involved.delete': [ROLES.SUPER_ADMIN],
  'get-involved.view': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN, ROLES.VIEWER],
  // Contact submissions
  'contact.view': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'contact.reply': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'contact.delete': [ROLES.SUPER_ADMIN],
  // Media
  'media.upload': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'media.delete': [ROLES.SUPER_ADMIN],
  'media.view': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN, ROLES.VIEWER],
  // Gallery & Event Glimpses
  'gallery.create': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'gallery.edit': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'gallery.delete': [ROLES.SUPER_ADMIN],
  'gallery.view': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN, ROLES.VIEWER],
  // Site settings
  'settings.view': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'settings.edit': [ROLES.SUPER_ADMIN],
  // Homepage
  'homepage.view': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  'homepage.edit': [ROLES.SUPER_ADMIN, ROLES.CONTENT_ADMIN],
  // User management
  'users.view': [ROLES.SUPER_ADMIN],
  'users.create': [ROLES.SUPER_ADMIN],
  'users.edit': [ROLES.SUPER_ADMIN],
  'users.delete': [ROLES.SUPER_ADMIN],
  // Feature flags
  'features.view': [ROLES.SUPER_ADMIN],
  'features.edit': [ROLES.SUPER_ADMIN],
  // Audit logs
  'audit.view': [ROLES.SUPER_ADMIN],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(role: Role, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission];
  return (allowedRoles as readonly string[]).includes(role);
}
