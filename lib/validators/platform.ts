import { z } from 'zod';

const optionalUrlSchema = z.preprocess((arg) => {
  if (typeof arg === 'string' && (arg.trim() === '' || arg === 'null' || arg === 'undefined')) {
    return null;
  }
  return arg;
}, z.string().url('Must be a valid URL').nullable().optional().or(z.literal('')));

const optionalStringSchema = (maxLen = 500) => z.preprocess((arg) => {
  if (typeof arg === 'string' && (arg.trim() === '' || arg === 'null' || arg === 'undefined')) {
    return null;
  }
  return arg;
}, z.string().max(maxLen).nullable().optional().or(z.literal('')));

export const createPlatformSchema = z.object({
  name: z.string().min(1, 'Platform name is required').max(100),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only').optional(),
  description: optionalStringSchema(500),
  longDescription: optionalStringSchema(5000),
  url: optionalUrlSchema,
  logoUrl: optionalStringSchema(1000),
  coverImageUrl: optionalStringSchema(1000),
  icon: optionalStringSchema(50),
  category: optionalStringSchema(50),
  status: z.enum(['live', 'coming_soon', 'under_development', 'temporarily_unavailable', 'draft', 'archived']).default('draft'),
  displayOrder: z.coerce.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  ctaText: z.string().max(50).default('Explore'),
  openInNewTab: z.boolean().default(true),
  accentColor: optionalStringSchema(20),
});

export const updatePlatformSchema = createPlatformSchema.partial().extend({
  id: z.string().uuid().optional(),
});

export type CreatePlatformInput = z.infer<typeof createPlatformSchema>;
export type UpdatePlatformInput = z.infer<typeof updatePlatformSchema>;