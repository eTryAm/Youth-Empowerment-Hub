import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/site-url';
import { getAllPublishedArticleSlugs } from '@/lib/public/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const staticPages: Array<{
    path: string;
    priority: number;
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  }> = [
    { path: '', priority: 1.0, changeFrequency: 'daily' },
    { path: '/about', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/platforms', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/initiatives', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/impact', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/get-involved', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/events', priority: 0.8, changeFrequency: 'daily' },
    { path: '/gallery', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/learn', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/contact', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    }),
  );

  // Dynamic article entries — only published articles
  let articleEntries: MetadataRoute.Sitemap = [];
  try {
    const publishedSlugs = await getAllPublishedArticleSlugs();
    articleEntries = publishedSlugs.map(({ slug, updatedAt }) => ({
      url: `${baseUrl}/learn/${slug}`,
      lastModified: updatedAt ?? new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch {
    // Non-fatal — sitemap still returns static pages
  }

  return [...staticEntries, ...articleEntries];
}
