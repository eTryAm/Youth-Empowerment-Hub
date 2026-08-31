export const siteConfig = {
  name: 'Youth Empowerment Hub',
  shortName: 'YEH',
  description: 'Empowering young people through education, skills, technology, opportunities, innovation, sports, community development, and social welfare.',
  tagline: 'Empowering Youth. Building Skills. Creating Opportunities. Shaping the Future.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/images/logo.png',
  creator: 'Youth Empowerment Hub',
  keywords: [
    'youth empowerment',
    'education',
    'skill development',
    'technology',
    'career opportunities',
    'entrepreneurship',
    'innovation',
    'digital literacy',
    'sports',
    'community development',
    'social welfare',
    'India',
  ],
} as const;

export const defaultNavItems = [
  { label: 'Home', url: '/' },
  { label: 'Opportunities', url: '/opportunities' },
  { label: 'Platforms', url: '/platforms' },
  { label: 'Initiatives', url: '/initiatives' },
  { label: 'Events', url: '/events' },
  { label: 'Gallery', url: '/gallery' },
  { label: 'About', url: '/about' },
  { label: 'Contact', url: '/contact' },
] as const;

export const objectiveCategories = [
  {
    key: 'education_skills',
    label: 'Education & Skills',
    icon: 'GraduationCap',
    description: 'Building foundations through knowledge and practical skills',
  },
  {
    key: 'career_opportunities',
    label: 'Career & Opportunities',
    icon: 'Briefcase',
    description: 'Connecting youth with career pathways and employment',
  },
  {
    key: 'technology_innovation',
    label: 'Technology & Innovation',
    icon: 'Cpu',
    description: 'Driving digital literacy and entrepreneurial thinking',
  },
  {
    key: 'community_welfare',
    label: 'Community & Welfare',
    icon: 'Heart',
    description: 'Strengthening communities through social support',
  },
  {
    key: 'collaboration',
    label: 'Collaboration',
    icon: 'Handshake',
    description: 'Partnering with institutions for greater impact',
  },
] as const;

export const initiativeCategories = [
  'Education',
  'Technology',
  'Sports',
  'Career',
  'Entrepreneurship',
  'Community Development',
  'Digital Literacy',
  'Social Welfare',
  'Youth Engagement',
] as const;

export const contactCategories = [
  'General Inquiry',
  'Partnership',
  'Volunteering',
  'Events',
  'Media',
  'Opportunities',
  'Other',
] as const;
