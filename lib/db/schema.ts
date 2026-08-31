import { pgTable, text, uuid, timestamp, boolean, integer, jsonb, pgEnum } from 'drizzle-orm/pg-core';

// Enums
export const platformStatusEnum = pgEnum('platform_status', ['live', 'coming_soon', 'under_development', 'temporarily_unavailable', 'draft', 'archived']);
export const contentStatusEnum = pgEnum('content_status', ['draft', 'published', 'archived']);
export const contactStatusEnum = pgEnum('contact_status', ['new', 'read', 'replied', 'archived']);
export const userRoleEnum = pgEnum('user_role', ['super_admin', 'content_admin', 'viewer']);
export const userStatusEnum = pgEnum('user_status', ['active', 'inactive', 'suspended']);

// Tables
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  role: userRoleEnum('role').default('viewer'),
  avatarUrl: text('avatar_url'),
  status: userStatusEnum('status').default('active'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const platforms = pgTable('platforms', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  longDescription: text('long_description'),
  url: text('url'),
  logoUrl: text('logo_url'),
  coverImageUrl: text('cover_image_url'),
  icon: text('icon'),
  category: text('category'),
  status: platformStatusEnum('status').default('draft'),
  displayOrder: integer('display_order').default(0),
  featured: boolean('featured').default(false),
  ctaText: text('cta_text').default('Explore'),
  openInNewTab: boolean('open_in_new_tab').default(true),
  accentColor: text('accent_color'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const initiatives = pgTable('initiatives', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  icon: text('icon'),
  imageUrl: text('image_url'),
  category: text('category'),
  status: contentStatusEnum('status').default('draft'),
  ctaText: text('cta_text'),
  ctaUrl: text('cta_url'),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const objectives = pgTable('objectives', {
  id: uuid('id').defaultRandom().primaryKey(),
  text: text('text').notNull(),
  category: text('category').notNull(),
  icon: text('icon'),
  displayOrder: integer('display_order').default(0),
  status: contentStatusEnum('status').default('published'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const events = pgTable('events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  date: timestamp('date'),
  endDate: timestamp('end_date'),
  time: text('time'),
  venue: text('venue'),
  district: text('district'),
  state: text('state'),
  category: text('category'),
  registrationUrl: text('registration_url'),
  imageUrl: text('image_url'),
  status: contentStatusEnum('status').default('draft'),
  featured: boolean('featured').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const announcements = pgTable('announcements', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  date: timestamp('date').defaultNow(),
  imageUrl: text('image_url'),
  externalUrl: text('external_url'),
  category: text('category'),
  featured: boolean('featured').default(false),
  status: contentStatusEnum('status').default('draft'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const impactMetrics = pgTable('impact_metrics', {
  id: uuid('id').defaultRandom().primaryKey(),
  label: text('label').notNull(),
  value: text('value'),
  description: text('description'),
  icon: text('icon'),
  displayOrder: integer('display_order').default(0),
  status: contentStatusEnum('status').default('draft'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const testimonials = pgTable('testimonials', {
  id: uuid('id').defaultRandom().primaryKey(),
  personName: text('person_name').notNull(),
  designation: text('designation'),
  organization: text('organization'),
  photoUrl: text('photo_url'),
  testimonialText: text('testimonial_text').notNull(),
  rating: integer('rating').default(5),
  featured: boolean('featured').default(false),
  status: contentStatusEnum('status').default('draft'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const partners = pgTable('partners', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  logoUrl: text('logo_url'),
  website: text('website'),
  description: text('description'),
  partnershipType: text('partnership_type'),
  displayOrder: integer('display_order').default(0),
  status: contentStatusEnum('status').default('draft'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const getInvolvedLinks = pgTable('get_involved_links', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  icon: text('icon'),
  url: text('url'),
  urlType: text('url_type').default('external'),
  displayOrder: integer('display_order').default(0),
  status: contentStatusEnum('status').default('published'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const contactSubmissions = pgTable('contact_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  subject: text('subject'),
  message: text('message').notNull(),
  category: text('category').default('general'),
  status: contactStatusEnum('status').default('new'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const media = pgTable('media', {
  id: uuid('id').defaultRandom().primaryKey(),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  url: text('url').notNull(),
  fileType: text('file_type'),
  mimeType: text('mime_type'),
  size: integer('size'),
  altText: text('alt_text'),
  uploadedBy: uuid('uploaded_by').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow(),
});

export const galleryItems = pgTable('gallery_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  mediaType: text('media_type').notNull().default('image'), // 'image' | 'video' | 'link'
  mediaUrl: text('media_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  category: text('category').default('Events'),
  eventDate: timestamp('event_date'),
  location: text('location'),
  externalLink: text('external_link'),
  featured: boolean('featured').default(false),
  displayOrder: integer('display_order').default(0),
  status: contentStatusEnum('status').default('published'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const siteSettings = pgTable('site_settings', {
  key: text('key').primaryKey(),
  value: text('value'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const homepageSections = pgTable('homepage_sections', {
  id: uuid('id').defaultRandom().primaryKey(),
  sectionKey: text('section_key').unique().notNull(),
  title: text('title'),
  subtitle: text('subtitle'),
  visible: boolean('visible').default(true),
  displayOrder: integer('display_order').default(0),
  config: jsonb('config'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const featureFlags = pgTable('feature_flags', {
  key: text('key').primaryKey(),
  enabled: boolean('enabled').default(false),
  description: text('description'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type'),
  entityId: text('entity_id'),
  metadata: jsonb('metadata'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const navigationItems = pgTable('navigation_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  label: text('label').notNull(),
  url: text('url').notNull(),
  displayOrder: integer('display_order').default(0),
  visible: boolean('visible').default(true),
  parentId: uuid('parent_id'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Platform = typeof platforms.$inferSelect;
export type NewPlatform = typeof platforms.$inferInsert;

export type Initiative = typeof initiatives.$inferSelect;
export type NewInitiative = typeof initiatives.$inferInsert;

export type Objective = typeof objectives.$inferSelect;
export type NewObjective = typeof objectives.$inferInsert;

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;

export type ImpactMetric = typeof impactMetrics.$inferSelect;
export type NewImpactMetric = typeof impactMetrics.$inferInsert;

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

export type Partner = typeof partners.$inferSelect;
export type NewPartner = typeof partners.$inferInsert;

export type GetInvolvedLink = typeof getInvolvedLinks.$inferSelect;
export type NewGetInvolvedLink = typeof getInvolvedLinks.$inferInsert;

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type NewContactSubmission = typeof contactSubmissions.$inferInsert;

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;

export type GalleryItem = typeof galleryItems.$inferSelect;
export type NewGalleryItem = typeof galleryItems.$inferInsert;

export type SiteSetting = typeof siteSettings.$inferSelect;
export type NewSiteSetting = typeof siteSettings.$inferInsert;

export type HomepageSection = typeof homepageSections.$inferSelect;
export type NewHomepageSection = typeof homepageSections.$inferInsert;

export type FeatureFlag = typeof featureFlags.$inferSelect;
export type NewFeatureFlag = typeof featureFlags.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

export type NavigationItem = typeof navigationItems.$inferSelect;
export type NewNavigationItem = typeof navigationItems.$inferInsert;
