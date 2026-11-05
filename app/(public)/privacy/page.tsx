import type { Metadata } from 'next';
import { SectionWrapper } from '@/components/shared/section-wrapper';

export const metadata: Metadata = {
  title: 'Privacy Policy — Youth Empowerment Hub',
  description:
    'Read the Privacy Policy of Youth Empowerment Hub. Learn how we collect, use, and protect your personal data, including information about Google AdSense and third-party services.',
  alternates: { canonical: '/privacy' },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <section className="bg-[#0A0F1C] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Privacy Policy</h1>
          <p className="text-slate-300">Last updated: November 2026</p>
        </div>
      </section>

      <SectionWrapper className="max-w-4xl mx-auto">
        <div className="prose prose-slate prose-lg max-w-none">

          <h2>1. Introduction</h2>
          <p>
            Youth Empowerment Hub (&ldquo;YEH&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is an
            independent, student-led youth development initiative operating the website at{' '}
            <strong>youthempowerment.in</strong> (&ldquo;the Platform&rdquo;).
          </p>
          <p>
            This Privacy Policy explains what personal data we collect when you use the Platform, how we use it, with
            whom we may share it, and your rights in relation to it. By using the Platform you agree to the practices
            described in this policy.
          </p>
          <p>
            Youth Empowerment Hub is currently an unregistered independent initiative. This policy describes our
            voluntary data practices. If you have any questions, please contact us at{' '}
            <a href="mailto:careers@youthempowerment.in">careers@youthempowerment.in</a>.
          </p>

          <h2>2. Information We Collect</h2>

          <h3>2.1 Information You Provide Directly</h3>
          <p>When you interact with our Platform, you may provide:</p>
          <ul>
            <li>
              <strong>Contact form submissions:</strong> your name, email address, phone number (optional), subject and
              message when you use our contact form.
            </li>
            <li>
              <strong>Account registration:</strong> if you register on any of our associated platforms (Opportunities
              Portal, BrainStorm), your name, email address and chosen password.
            </li>
            <li>
              <strong>Participation and application forms:</strong> information you submit when applying for listed
              opportunities, campus ambassador programmes, or volunteer roles.
            </li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <p>When you visit the Platform, our servers and third-party services may automatically collect:</p>
          <ul>
            <li>
              <strong>Technical data:</strong> IP address, browser type and version, operating system, device type, time
              zone, referring URL, and pages visited.
            </li>
            <li>
              <strong>Usage data:</strong> pages viewed, time spent on pages, links clicked, and navigation paths.
            </li>
            <li>
              <strong>Cookie data:</strong> session identifiers, preference settings, and advertising-related
              identifiers. See Section 5 for details.
            </li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <p>We use the information collected to:</p>
          <ul>
            <li>Respond to your contact form submissions and enquiries.</li>
            <li>Provide access to and operate the Platform and its associated services.</li>
            <li>Send updates about opportunities, events, and initiatives where you have opted in.</li>
            <li>Improve the Platform&apos;s content, navigation, and user experience.</li>
            <li>Detect and prevent fraud, abuse, or misuse of the Platform.</li>
            <li>Comply with our legal obligations.</li>
            <li>Serve contextually relevant advertisements (see Section 5).</li>
          </ul>

          <h2>4. Data Sharing and Disclosure</h2>
          <p>
            We do <strong>not</strong> sell your personal data. We may share it in limited circumstances:
          </p>
          <ul>
            <li>
              <strong>Third-party service providers:</strong> We use Supabase for database hosting and authentication,
              and Vercel for website hosting. These providers process data on our behalf and are contractually bound to
              handle it securely.
            </li>
            <li>
              <strong>Google AdSense:</strong> We display advertisements through Google AdSense (Publisher ID:
              ca-pub-8479038746831074). Google may collect data through cookies and similar technologies to serve
              personalised advertisements. See Section 5.
            </li>
            <li>
              <strong>Legal requirements:</strong> We may disclose information if required to do so by applicable law or
              in response to valid legal requests.
            </li>
          </ul>

          <h2>5. Cookies and Advertising</h2>
          <p>
            Cookies are small files stored on your browser. We use cookies for the following purposes:
          </p>
          <ul>
            <li>
              <strong>Essential cookies:</strong> Required for the Platform to function, including authentication
              sessions and security measures.
            </li>
            <li>
              <strong>Analytics cookies:</strong> Help us understand how visitors use the Platform so we can improve it.
            </li>
            <li>
              <strong>Advertising cookies:</strong> The Platform uses Google AdSense to display advertisements. Google
              and its partners use cookies to serve ads based on your prior visits to this website and other websites.
              Google&apos;s use of advertising cookies enables it and its partners to serve ads based on your visit to
              our site and/or other sites on the Internet.
            </li>
          </ul>
          <p>
            You may opt out of personalised advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Google&apos;s Ads Settings
            </a>
            . You can also opt out through the{' '}
            <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">
              Network Advertising Initiative opt-out page
            </a>
            .
          </p>
          <p>
            Most browsers allow you to control cookies through their settings. Disabling cookies may affect the
            functionality of the Platform.
          </p>

          <h2>6. Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to fulfil the purposes described in this policy:
          </p>
          <ul>
            <li>
              <strong>Contact form submissions:</strong> retained for up to 12 months after the matter is resolved.
            </li>
            <li>
              <strong>Account information:</strong> retained while your account is active and for a reasonable period
              thereafter for administrative purposes.
            </li>
            <li>
              <strong>Server and access logs:</strong> typically retained for 30–90 days.
            </li>
          </ul>

          <h2>7. Children&apos;s Privacy</h2>
          <p>
            The Platform is designed for young people aged 13 and above. We do not knowingly collect personal data from
            children under the age of 13. If you believe we have inadvertently collected such data, please contact us
            immediately at{' '}
            <a href="mailto:careers@youthempowerment.in">careers@youthempowerment.in</a> and we will delete it promptly.
          </p>
          <p>
            Users aged 13–17 are encouraged to review this policy with a parent or guardian.
          </p>

          <h2>8. Security</h2>
          <p>
            We implement reasonable technical and organisational measures to protect your personal data against
            unauthorised access, loss, or misuse. These include encrypted data transmission (HTTPS), access controls,
            and secure hosting infrastructure via Supabase and Vercel. However, no method of transmission over the
            internet is completely secure, and we cannot guarantee absolute security.
          </p>

          <h2>9. External Links</h2>
          <p>
            The Platform contains links to third-party websites, opportunity portals, and external resources. We are not
            responsible for the privacy practices of these external sites. We encourage you to read their privacy
            policies before submitting personal data.
          </p>

          <h2>10. Your Rights</h2>
          <p>
            Depending on your location, you may have the following rights in relation to your personal data:
          </p>
          <ul>
            <li>The right to access the personal data we hold about you.</li>
            <li>The right to request correction of inaccurate data.</li>
            <li>The right to request deletion of your data where we no longer have a lawful basis to retain it.</li>
            <li>The right to withdraw consent at any time where processing is based on consent.</li>
            <li>The right to object to processing for direct marketing purposes.</li>
          </ul>
          <p>
            To exercise any of these rights, please write to us at{' '}
            <a href="mailto:careers@youthempowerment.in">careers@youthempowerment.in</a>. We will endeavour to respond
            within a reasonable time.
          </p>

          <h2>11. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we make material changes, we will update the
            &ldquo;Last updated&rdquo; date at the top of this page. We encourage you to review this policy periodically.
            Continued use of the Platform after changes constitutes acceptance of the updated policy.
          </p>

          <h2>12. Contact</h2>
          <p>
            For any questions, concerns, or requests relating to this Privacy Policy or our data practices, please
            contact us:
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
