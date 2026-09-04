import type { Metadata } from 'next';
import { Mail, MapPin, Phone } from 'lucide-react';
import { PageHero } from '@/components/public/page-hero';
import { ContactForm } from '@/components/public/contact-form';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { getPublicSettings } from '@/lib/public/queries';
import { resolveContactCategory } from '@/lib/public/contact';
import { JsonLd } from '@/components/seo/json-ld';
import { webPageSchema } from '@/components/seo/schema';

export const metadata: Metadata = {
  title: 'Contact Us — Youth Empowerment Hub',
  description:
    'Get in touch with the Youth Empowerment Hub team. Reach out for student partnerships, volunteer opportunities, event collaborations, media inquiries, or general support.',
  keywords: [
    'contact youth empowerment hub',
    'reach youth organization India',
    'youth NGO contact',
    'volunteer inquiry India',
    'partnership inquiry youth',
  ],
  alternates: { canonical: '/contact' },
  openGraph: {
    title: 'Contact Us — Youth Empowerment Hub',
    description:
      'Have questions or want to collaborate? Connect with the Youth Empowerment Hub team across India.',
    url: '/contact',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Contact Youth Empowerment Hub' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us — Youth Empowerment Hub',
    description: 'Get in touch with our team for collaborations, volunteering, and queries.',
    images: ['/og-image.jpg'],
  },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const [{ category }, settings] = await Promise.all([searchParams, getPublicSettings()]);
  const defaultCategory = resolveContactCategory(category);
  const email = settings.contact_email;
  const phone = settings.contact_phone;
  const address = settings.address;

  return (
    <div className="flex flex-col bg-slate-50">
      <JsonLd
        data={webPageSchema({
          name: 'Contact Us — Youth Empowerment Hub',
          description:
            'Have questions or want to collaborate? We would love to hear from you.',
          url: 'https://youthempowerment.in/contact',
          breadcrumb: [
            { name: 'Home', url: 'https://youthempowerment.in' },
            { name: 'Contact', url: 'https://youthempowerment.in/contact' },
          ],
        })}
      />
      <PageHero
        title="Contact Us"
        subtitle="Have questions or want to collaborate? Send a message and our team will get back to you."
      />

      <SectionWrapper>
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Get in Touch</h2>
              <p className="text-slate-600">
                Fill out the form and our team will get back to you within 24–48 hours.
              </p>
            </div>

            <div className="space-y-6">
              {email ? (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Email</h3>
                    <a href={`mailto:${email}`} className="text-slate-600 hover:text-blue-600 transition-colors break-all">
                      {email}
                    </a>
                  </div>
                </div>
              ) : null}

              {phone ? (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Phone</h3>
                    <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-slate-600 hover:text-cyan-600 transition-colors">
                      {phone}
                    </a>
                  </div>
                </div>
              ) : null}

              {address ? (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Office</h3>
                    <p className="text-slate-600 whitespace-pre-line">{address}</p>
                  </div>
                </div>
              ) : null}

              {!email && !phone && !address ? (
                <p className="text-slate-500 text-sm">
                  Contact details will appear here once they are published in site settings.
                </p>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
              <ContactForm defaultCategory={defaultCategory} />
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
}
