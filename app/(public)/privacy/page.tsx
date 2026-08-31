import type { Metadata } from 'next';
import { SectionWrapper } from '@/components/shared/section-wrapper';

export const metadata: Metadata = {
  title: 'Privacy Policy | Youth Empowerment Hub',
  description: 'Our privacy policy and data handling practices.',
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="bg-[#0A0F1C] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Privacy Policy</h1>
          <p className="text-slate-300">Last updated: August 2026</p>
        </div>
      </section>

      <SectionWrapper className="max-w-4xl mx-auto">
        <div className="prose prose-slate prose-lg max-w-none">
          <p className="text-slate-600 italic mb-8">
            Our privacy policy is currently being prepared. Please check back soon for detailed information about how we collect, use, and protect your data.
          </p>
          
          <h2>1. Introduction</h2>
          <p>
            Welcome to the Youth Empowerment Hub. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
          </p>
          
          <h2>2. Data Collection</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we will group together as follows:
          </p>
          <ul>
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
            <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
          </ul>

          <p className="mt-8 text-sm text-slate-500">
            For immediate privacy concerns, please contact us at privacy@youthempowermenthub.org
          </p>
        </div>
      </SectionWrapper>
    </div>
  );
}
