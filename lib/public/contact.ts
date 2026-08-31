import { contactCategories } from '@/config/site';

export function resolveContactCategory(raw?: string | null): string {
  if (!raw) return '';
  const exact = contactCategories.find(
    (category) => category.toLowerCase() === raw.trim().toLowerCase()
  );
  if (exact) return exact;

  const key = raw.toLowerCase();
  if (key.includes('mentor') || key.includes('ambassador') || key.includes('opportunit')) {
    return 'Opportunities';
  }
  if (key.includes('partner')) return 'Partnership';
  if (key.includes('volunteer')) return 'Volunteering';
  if (key.includes('event')) return 'Events';
  if (key.includes('media')) return 'Media';
  if (key.includes('sponsor') || key.includes('donat') || key.includes('support')) {
    return 'Other';
  }
  return 'General Inquiry';
}

export function involvedContactHref(title: string) {
  return `/contact?category=${encodeURIComponent(resolveContactCategory(title))}`;
}
