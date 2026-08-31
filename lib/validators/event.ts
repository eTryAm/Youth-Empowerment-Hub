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

export const createEventSchema = z.object({
  title: z.string().min(1, 'Event title is required').max(200),
  description: z.preprocess((arg) => typeof arg === 'string' && arg.trim() === '' ? null : arg, z.string().max(5000).nullable().optional()),
  date: optionalDateSchema,
  endDate: optionalDateSchema,
  time: optionalStringSchema(50),
  venue: optionalStringSchema(200),
  district: optionalStringSchema(100),
  state: optionalStringSchema(100),
  category: optionalStringSchema(50),
  registrationUrl: optionalUrlSchema,
  imageUrl: optionalStringSchema(1000),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
});

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().uuid().optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;