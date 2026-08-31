import { z } from 'zod';

export const siteSettingsSchema = z.object({
  org_name: z.string().max(200).optional(),
  tagline: z.string().max(500).optional(),
  logo_url: z.string().optional(),
  favicon_url: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  social_instagram: z.string().url().optional().or(z.literal('')),
  social_youtube: z.string().url().optional().or(z.literal('')),
  social_facebook: z.string().url().optional().or(z.literal('')),
  social_linkedin: z.string().url().optional().or(z.literal('')),
  social_twitter: z.string().url().optional().or(z.literal('')),
  footer_text: z.string().max(1000).optional(),
  copyright_text: z.string().max(200).optional(),
  privacy_policy: z.string().max(50000).optional(),
  terms_of_use: z.string().max(50000).optional(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export const featureFlagSchema = z.object({
  key: z.string().min(1),
  enabled: z.boolean(),
  description: z.string().max(500).optional(),
});

export type FeatureFlagInput = z.infer<typeof featureFlagSchema>;

export const homepageSectionSchema = z.object({
  sectionKey: z.string().min(1),
  title: z.string().max(200).optional(),
  subtitle: z.string().max(500).optional(),
  visible: z.boolean().default(true),
  displayOrder: z.coerce.number().int().min(0).default(0),
  config: z.record(z.unknown()).optional(),
});

export type HomepageSectionInput = z.infer<typeof homepageSectionSchema>;
