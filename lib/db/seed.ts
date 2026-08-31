import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL is not set. Please configure your .env file.');
  process.exit(1);
}

async function seed() {
  console.log('🌱 Seeding database...\n');

  const client = postgres(connectionString!, { prepare: false });
  const db = drizzle(client, { schema });

  try {
    // ── 1. Seed Site Settings ──
    console.log('⚙️  Seeding site settings...');
    const settingsData = [
      { key: 'org_name', value: 'Youth Empowerment Hub' },
      { key: 'tagline', value: 'Empowering Youth. Building Skills. Creating Opportunities. Shaping the Future.' },
      { key: 'contact_email', value: '' },
      { key: 'contact_phone', value: '' },
      { key: 'address', value: '' },
      { key: 'social_instagram', value: '' },
      { key: 'social_youtube', value: '' },
      { key: 'social_facebook', value: '' },
      { key: 'social_linkedin', value: '' },
      { key: 'social_twitter', value: '' },
      { key: 'footer_text', value: 'Empowering young people through education, skills, technology, opportunities, innovation, sports, community development, and social welfare.' },
      { key: 'copyright_text', value: `© ${new Date().getFullYear()} Youth Empowerment Hub. All rights reserved.` },
    ];

    for (const setting of settingsData) {
      await db
        .insert(schema.siteSettings)
        .values(setting)
        .onConflictDoNothing({ target: schema.siteSettings.key });
    }

    // ── 2. Seed Feature Flags ──
    console.log('🚩 Seeding feature flags...');
    const featureFlags = [
      { key: 'donation_enabled', enabled: false, description: 'Enable donation CTA and section on the public website' },
      { key: 'events_enabled', enabled: true, description: 'Show events section on the public website' },
      { key: 'testimonials_enabled', enabled: true, description: 'Show testimonials section when testimonials exist' },
      { key: 'partners_enabled', enabled: true, description: 'Show partners section when partners exist' },
      { key: 'announcements_enabled', enabled: true, description: 'Show announcements bar on the public website' },
      { key: 'opportunities_enabled', enabled: false, description: 'Enable opportunities platform integration' },
      { key: 'contact_form_enabled', enabled: true, description: 'Enable the public contact form' },
      { key: 'get_involved_enabled', enabled: true, description: 'Show get involved section' },
    ];

    for (const flag of featureFlags) {
      await db
        .insert(schema.featureFlags)
        .values(flag)
        .onConflictDoNothing({ target: schema.featureFlags.key });
    }

    // ── 3. Seed Homepage Sections ──
    console.log('📄 Seeding homepage sections...');
    const homepageSections = [
      { sectionKey: 'hero', title: 'Hero', visible: true, displayOrder: 0 },
      { sectionKey: 'mission', title: 'What We Believe', visible: true, displayOrder: 1 },
      { sectionKey: 'objectives', title: 'Our Focus Areas', visible: true, displayOrder: 2 },
      { sectionKey: 'platforms', title: 'Digital Platforms', visible: true, displayOrder: 3 },
      { sectionKey: 'initiatives', title: 'Current Initiatives', visible: true, displayOrder: 4 },
      { sectionKey: 'events', title: 'Upcoming Events', visible: true, displayOrder: 5 },
      { sectionKey: 'future_vision', title: 'Future Vision', visible: true, displayOrder: 6 },
      { sectionKey: 'impact', title: 'Impact', visible: true, displayOrder: 7 },
      { sectionKey: 'get_involved', title: 'Get Involved', visible: true, displayOrder: 8 },
      { sectionKey: 'testimonials', title: 'Testimonials', visible: true, displayOrder: 9 },
      { sectionKey: 'partners', title: 'Partners', visible: true, displayOrder: 10 },
      { sectionKey: 'donation_cta', title: 'Donation CTA', visible: true, displayOrder: 11 },
    ];

    for (const section of homepageSections) {
      await db
        .insert(schema.homepageSections)
        .values(section)
        .onConflictDoNothing({ target: schema.homepageSections.sectionKey });
    }

    // ── 4. Seed Objectives (13 official objectives) ──
    console.log('🎯 Seeding objectives...');
    const objectivesData = [
      { text: 'To promote education, skill development, and youth empowerment.', category: 'education_skills', icon: 'GraduationCap', displayOrder: 1 },
      { text: 'To organize quizzes, debates, competitions, seminars, and workshops.', category: 'education_skills', icon: 'Trophy', displayOrder: 2 },
      { text: 'To conduct IT training, coding programs, and hands-on technical education.', category: 'technology_innovation', icon: 'Code', displayOrder: 3 },
      { text: 'To promote digital awareness and e-sports activities in a constructive and educational manner.', category: 'technology_innovation', icon: 'Monitor', displayOrder: 4 },
      { text: 'To provide career guidance, counseling, and mentorship programs.', category: 'career_opportunities', icon: 'Compass', displayOrder: 5 },
      { text: 'To create internship and employment opportunities, especially for local youth.', category: 'career_opportunities', icon: 'Briefcase', displayOrder: 6 },
      { text: 'To establish and operate a job portal/platform for employment assistance.', category: 'career_opportunities', icon: 'Search', displayOrder: 7 },
      { text: 'To provide scholarships, study materials, and educational support to needy students.', category: 'community_welfare', icon: 'BookOpen', displayOrder: 8 },
      { text: 'To promote entrepreneurship, startups, and innovation.', category: 'technology_innovation', icon: 'Lightbulb', displayOrder: 9 },
      { text: 'To collaborate with educational institutions, companies, NGOs, and government bodies.', category: 'collaboration', icon: 'Handshake', displayOrder: 10 },
      { text: 'To conduct social welfare and community development programs.', category: 'community_welfare', icon: 'Heart', displayOrder: 11 },
      { text: 'To promote digital literacy and inclusion.', category: 'community_welfare', icon: 'Laptop', displayOrder: 12 },
      { text: 'To establish training centers, libraries, and educational facilities.', category: 'education_skills', icon: 'Building', displayOrder: 13 },
    ];

    for (const obj of objectivesData) {
      await db
        .insert(schema.objectives)
        .values({ ...obj, status: 'published' })
        .onConflictDoNothing();
    }

    // ── 5. Seed Initial Platforms ──
    console.log('🌐 Seeding initial platforms...');
    const platformsData = [
      {
        name: 'Opportunities Portal',
        slug: 'opportunities',
        description: 'The central portal for youth to discover internships, career opportunities, job listings, scholarships, competitions, and mentorship programs.',
        longDescription: 'The Opportunities Portal is the premier destination for youth empowerment. It brings together verified internships, career development programs, competitive fellowships, educational scholarships, and talent discovery grants into one accessible, easy-to-navigate gateway.',
        url: '/opportunities',
        icon: 'Briefcase',
        category: 'Careers & Opportunities',
        status: 'live' as const,
        displayOrder: 1,
        featured: true,
        ctaText: 'Launch Opportunities Portal',
        openInNewTab: false,
        accentColor: '#2563EB',
      },
      {
        name: 'BrainStorm',
        slug: 'brainstorm',
        description: 'Digital learning, technical training, interactive problem solving, and knowledge-sharing platform for young innovators.',
        longDescription: 'BrainStorm is a youth-focused digital platform designed for learning, engagement, and community interaction. It provides tools and resources for students and young professionals to enhance their knowledge and skills.',
        url: '/platforms#brainstorm',
        icon: 'Brain',
        category: 'Education & Tech',
        status: 'live' as const,
        displayOrder: 2,
        featured: true,
        ctaText: 'Explore BrainStorm',
        openInNewTab: false,
        accentColor: '#7C3AED',
      },
      {
        name: 'CricketLive',
        slug: 'cricketlive',
        description: 'Real-time sports updates, youth tournament management, athletic development, and constructive sports engagement.',
        longDescription: 'CricketLive is our live sports platform that brings real-time cricket scores, match updates, and constructive sports engagement to the youth community.',
        url: '/platforms#cricketlive',
        icon: 'Trophy',
        category: 'Sports & Athletics',
        status: 'live' as const,
        displayOrder: 3,
        featured: true,
        ctaText: 'Explore CricketLive',
        openInNewTab: false,
        accentColor: '#10B981',
      },
    ];

    for (const platform of platformsData) {
      await db
        .insert(schema.platforms)
        .values(platform)
        .onConflictDoNothing();
    }

    // ── 6. Seed Navigation Items ──
    console.log('🧭 Seeding navigation items...');
    const navItems = [
      { label: 'Home', url: '/', displayOrder: 0, visible: true },
      { label: 'About', url: '/about', displayOrder: 1, visible: true },
      { label: 'Initiatives', url: '/initiatives', displayOrder: 2, visible: true },
      { label: 'Platforms', url: '/platforms', displayOrder: 3, visible: true },
      { label: 'Events', url: '/events', displayOrder: 4, visible: true },
      { label: 'Impact', url: '/impact', displayOrder: 5, visible: true },
      { label: 'Get Involved', url: '/get-involved', displayOrder: 6, visible: true },
      { label: 'Contact', url: '/contact', displayOrder: 7, visible: true },
    ];

    for (const item of navItems) {
      await db
        .insert(schema.navigationItems)
        .values(item)
        .onConflictDoNothing();
    }

    // ── 7. Seed Get Involved Links ──
    console.log('🤝 Seeding get involved links...');
    const getInvolvedData = [
      { title: 'Partner With Us', description: 'Collaborate with us as an educational institution, enterprise, NGO, or government body.', icon: 'Handshake', url: '/contact?category=Partnership', urlType: 'internal', displayOrder: 1, status: 'published' as const },
    ];

    for (const link of getInvolvedData) {
      await db
        .insert(schema.getInvolvedLinks)
        .values(link)
        .onConflictDoNothing();
    }

    // ── 8. Seed Impact Metrics (qualitative placeholders) ──
    console.log('📊 Seeding impact metrics...');
    const impactMetrics = [
      { label: 'Students Reached', value: '', description: 'Young people engaged through our education and skill programs.', icon: 'Users', displayOrder: 1, status: 'published' as const },
      { label: 'Educational Programs', value: '', description: 'Programs conducted across education, technology, and skill development.', icon: 'BookOpen', displayOrder: 2, status: 'published' as const },
      { label: 'Digital Platforms', value: '3', description: 'Platforms built to serve the youth ecosystem.', icon: 'Globe', displayOrder: 3, status: 'published' as const },
      { label: 'Community Initiatives', value: '', description: 'Social welfare and community development programs organized.', icon: 'Heart', displayOrder: 4, status: 'published' as const },
    ];

    for (const metric of impactMetrics) {
      await db
        .insert(schema.impactMetrics)
        .values(metric)
        .onConflictDoNothing();
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Create your admin user in Supabase Dashboard → Authentication → Users');
    console.log('   2. Add that user to the users table with role "super_admin"');
    console.log('   3. Update platform URLs when your platforms are deployed');
    console.log('   4. Configure social links and contact info in Admin → Settings\n');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

seed();
