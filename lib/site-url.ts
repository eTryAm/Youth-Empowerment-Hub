/**
 * Canonical site URL helper.
 *
 * Ensures the production custom domain (https://www.youthempowerment.in) is
 * consistently used in metadataBase, sitemaps, robots.txt, and structured data,
 * even if NEXT_PUBLIC_SITE_URL was configured with a vercel.app preview URL.
 */
export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!envUrl || envUrl.includes('vercel.app')) {
    return 'https://www.youthempowerment.in';
  }
  if (envUrl.includes('youthempowerment.in')) {
    return 'https://www.youthempowerment.in';
  }
  return envUrl.replace(/\/$/, '');
}
