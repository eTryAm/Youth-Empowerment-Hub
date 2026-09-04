/**
 * Pre-built JSON-LD schema objects for Youth Empowerment Hub.
 * Used with the <JsonLd> component for structured data injection.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://youthempowerment.in';
const LOGO_URL = `${BASE_URL}/icon-512.png`;
const OG_IMAGE  = `${BASE_URL}/og-image.jpg`;

/** Organization schema — tells Google who you are */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'Youth Empowerment Hub',
  alternateName: 'YEH',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: LOGO_URL,
    width: 512,
    height: 512,
  },
  image: OG_IMAGE,
  description:
    'Youth Empowerment Hub is an organization dedicated to empowering young people across India through education, skill development, technology, entrepreneurship, sports, and community building.',
  foundingDate: '2024',
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  knowsAbout: [
    'Youth Development',
    'Skill Development',
    'Education',
    'Entrepreneurship',
    'Digital Literacy',
    'Sports Development',
    'Community Development',
    'Career Opportunities',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://youthempowerment.in',
  ],
};

/** WebSite schema — enables Google Sitelinks Search Box */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'Youth Empowerment Hub',
  description:
    'Empowering young people through education, skills, technology, opportunities, innovation, sports, and community development.',
  publisher: {
    '@id': `${BASE_URL}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/initiatives?category={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'en-IN',
};

/** Breadcrumb schema factory */
export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** WebPage schema factory — for secondary pages */
export function webPageSchema({
  name,
  description,
  url,
  breadcrumb,
}: {
  name: string;
  description: string;
  url: string;
  breadcrumb?: Array<{ name: string; url: string }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': `${BASE_URL}/#website` },
    publisher: { '@id': `${BASE_URL}/#organization` },
    inLanguage: 'en-IN',
    ...(breadcrumb
      ? {
          breadcrumb: breadcrumbSchema(breadcrumb),
        }
      : {}),
  };
}
