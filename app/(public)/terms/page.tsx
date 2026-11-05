import type { Metadata } from 'next';
import { SectionWrapper } from '@/components/shared/section-wrapper';

export const metadata: Metadata = {
  title: 'Terms of Use — Youth Empowerment Hub',
  description:
    'Read the Terms of Use for the Youth Empowerment Hub platform. Understand your rights, responsibilities, and the conditions governing your use of our services.',
  alternates: { canonical: '/terms' },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="bg-[#0A0F1C] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Terms of Use</h1>
          <p className="text-slate-300">Last updated: November 2026</p>
        </div>
      </section>

      <SectionWrapper className="max-w-4xl mx-auto">
        <div className="prose prose-slate prose-lg max-w-none">

          <h2>1. About Youth Empowerment Hub</h2>
          <p>
            Youth Empowerment Hub (&ldquo;YEH&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is an
            independent, student-led youth development initiative. It is <strong>not</strong> a registered NGO, trust,
            Section 8 company, or any other formal legal entity. YEH operates voluntarily with the goal of contributing
            to youth welfare, skill development, educational access, and community participation.
          </p>
          <p>
            By accessing or using the Platform at <strong>youthempowerment.in</strong> (&ldquo;the Platform&rdquo;),
            you agree to be bound by these Terms of Use (&ldquo;Terms&rdquo;). If you do not agree, please do not use
            the Platform.
          </p>

          <h2>2. Eligibility</h2>
          <p>
            The Platform is intended for users aged 13 and above. By using the Platform, you confirm that you are at
            least 13 years old. Users under the age of 18 are encouraged to use the Platform with parental or guardian
            awareness.
          </p>

          <h2>3. Acceptable Use</h2>
          <p>You agree to use the Platform only for lawful purposes and in a manner consistent with these Terms. You must not:</p>
          <ul>
            <li>Use the Platform in any way that violates applicable law or regulation.</li>
            <li>Post, transmit, or distribute content that is defamatory, hateful, discriminatory, abusive, or harmful.</li>
            <li>Attempt to gain unauthorised access to any part of the Platform or its systems.</li>
            <li>Use automated bots, scrapers, or similar tools to harvest data from the Platform without written permission.</li>
            <li>Impersonate Youth Empowerment Hub, its contributors, or any third party.</li>
            <li>Use the Platform to send unsolicited communications (spam).</li>
            <li>Upload or transmit malware, viruses, or any malicious code.</li>
          </ul>

          <h2>4. Educational Content and Learning Hub</h2>
          <p>
            The Platform provides educational resources, articles, tutorials, and guides through the YEH Learning Hub
            and other sections. This content is provided for general informational and educational purposes only.
          </p>
          <ul>
            <li>
              Content is authored or curated by YEH contributors and is not a substitute for professional advice in any
              field (legal, medical, financial, or otherwise).
            </li>
            <li>
              We strive for accuracy but do not guarantee that educational content is complete, current, or error-free.
            </li>
            <li>
              External links and opportunity listings are provided as a convenience. YEH does not endorse, verify, or
              take responsibility for the content of external websites or the legitimacy of third-party opportunities.
            </li>
          </ul>
          <p>
            Users are strongly encouraged to independently verify any opportunity, scholarship, internship, or external
            programme before applying or submitting personal information to a third party.
          </p>

          <h2>5. Opportunities and Listings</h2>
          <p>
            YEH provides information about internships, scholarships, jobs, campus ambassador programmes, and other
            youth opportunities. These listings are curated for informational purposes.
          </p>
          <ul>
            <li>YEH does not guarantee the availability, accuracy, or legitimacy of any listed opportunity.</li>
            <li>YEH is not a recruitment agency and does not enter into employment or contractual relationships with users on behalf of third parties.</li>
            <li>Always verify opportunities directly with the official source before applying.</li>
          </ul>

          <h2>6. Contact Forms and User Submissions</h2>
          <p>
            When you submit information through our contact form or other participation forms, you grant YEH the right
            to use that information to respond to your enquiry. We will handle your data in accordance with our{' '}
            <a href="/privacy">Privacy Policy</a>.
          </p>
          <p>
            By submitting content (such as feedback, suggestions, or ideas), you grant YEH a non-exclusive,
            royalty-free licence to use, reproduce, and display that content for the purposes of operating and improving
            the Platform.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            All original content on the Platform — including text, graphics, logos, article content, the YEH name and
            branding — is the intellectual property of Youth Empowerment Hub and its contributors. It is protected under
            applicable copyright and intellectual property laws.
          </p>
          <p>
            You may not reproduce, distribute, modify, or use Platform content for commercial purposes without express
            written permission. For educational or non-commercial sharing, please provide appropriate attribution to
            Youth Empowerment Hub.
          </p>

          <h2>8. Donations and Financial Contributions</h2>
          <p>
            Where the Platform displays a donation or community support section, any contribution is entirely voluntary
            and made to support the operational continuity of this independent initiative. 
          </p>
          <ul>
            <li>YEH is not a registered charitable organisation and cannot issue tax-exempt receipts.</li>
            <li>Donations do not confer membership, ownership, or any claim over the initiative.</li>
            <li>We will make reasonable efforts to use contributions toward the stated purpose of youth development activities.</li>
          </ul>

          <h2>9. Advertisements</h2>
          <p>
            The Platform may display third-party advertisements through Google AdSense. YEH does not endorse the
            products or services advertised. Advertisement content is controlled by Google based on its advertising
            policies. We are not responsible for the accuracy or suitability of advertised content.
          </p>

          <h2>10. Disclaimer of Warranties</h2>
          <p>
            The Platform is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. Youth Empowerment
            Hub makes no warranties, express or implied, including but not limited to merchantability, fitness for a
            particular purpose, or non-infringement.
          </p>
          <p>
            We do not warrant that the Platform will be uninterrupted, error-free, or free from harmful components. Use
            of the Platform is at your own risk.
          </p>

          <h2>11. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Youth Empowerment Hub and its contributors shall not be
            liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of
            or inability to use the Platform, including but not limited to loss of data, loss of opportunity, or
            reputational harm.
          </p>

          <h2>12. Third-Party Links and Services</h2>
          <p>
            The Platform contains links to third-party websites and platforms (including the Opportunities Portal,
            BrainStorm, and CricketLive). These are operated independently and subject to their own terms and privacy
            policies. YEH is not responsible for the content, practices, or policies of these external services.
          </p>

          <h2>13. Modifications to the Platform</h2>
          <p>
            YEH reserves the right to modify, suspend, or discontinue any feature or section of the Platform at any
            time without prior notice. We are not liable to you or any third party for any such modification or
            discontinuation.
          </p>

          <h2>14. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. When we make material changes, we will update the &ldquo;Last
            updated&rdquo; date at the top of this page. Continued use of the Platform after such changes constitutes
            your acceptance of the revised Terms.
          </p>

          <h2>15. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes arising in connection with these Terms or the
            Platform shall be subject to the jurisdiction of the courts of India.
          </p>

          <h2>16. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:careers@youthempowerment.in">careers@youthempowerment.in</a>
            </li>
            <li>
              <strong>Website:</strong> <a href="https://youthempowerment.in">youthempowerment.in</a>
            </li>
          </ul>
        </div>
      </SectionWrapper>
    </div>
  );
}
