import type { Metadata } from 'next';
import { SectionWrapper } from '@/components/shared/section-wrapper';

export const metadata: Metadata = {
  title: 'Terms of Use | Youth Empowerment Hub',
  description: 'Terms and conditions for using our platform.',
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="bg-[#0A0F1C] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Terms of Use</h1>
          <p className="text-slate-300">Last updated: August 2026</p>
        </div>
      </section>

      <SectionWrapper className="max-w-4xl mx-auto">
        <div className="prose prose-slate prose-lg max-w-none">
          <p className="text-slate-600 italic mb-8">
            Our terms of use are currently being prepared. Please check back soon for detailed information.
          </p>
          
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using our platform, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the platform.
          </p>
          
          <h2>2. Acceptable Use</h2>
          <p>
            You agree not to use the platform in any way that causes, or may cause, damage to the platform or impairment of the availability or accessibility of the platform.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            The platform and its original content, features, and functionality are owned by Youth Empowerment Hub and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>

          <p className="mt-8 text-sm text-slate-500">
            For questions about these terms, please contact us at legal@youthempowermenthub.org
          </p>
        </div>
      </SectionWrapper>
    </div>
  );
}
