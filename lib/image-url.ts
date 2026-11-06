/**
 * Sanitizes and extracts direct image links from search engine redirect/preview URLs
 * (e.g., Bing Images search, Google Images search).
 */
export function cleanImageUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);

    // Extract direct image from Bing Image search URL
    if (url.hostname.includes('bing.com') && url.searchParams.has('mediaurl')) {
      const media = url.searchParams.get('mediaurl');
      if (media) return decodeURIComponent(media);
    }

    // Extract direct image from Google Image search URL
    if (url.hostname.includes('google.') && url.searchParams.has('imgurl')) {
      const img = url.searchParams.get('imgurl');
      if (img) return decodeURIComponent(img);
    }
  } catch {
    // If not a parseable URL, return trimmed as is
  }

  return trimmed;
}
