import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Mail, Phone, MapPin, Github } from 'lucide-react';
import { defaultNavItems, siteConfig } from '@/config/site';

interface FooterProps {
  settings?: Record<string, string>;
}

function WhatsAppIcon({ className = 'h-5 w-5', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

function DiscordIcon({ className = 'h-5 w-5', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

function TelegramIcon({ className = 'h-5 w-5', ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} {...props}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  );
}

const socialConfig = [
  { key: 'social_instagram', icon: Instagram, label: 'Instagram' },
  { key: 'social_youtube', icon: Youtube, label: 'YouTube' },
  { key: 'social_linkedin', icon: Linkedin, label: 'LinkedIn' },
  { key: 'social_twitter', icon: Twitter, label: 'X (Twitter)' },
  { key: 'social_facebook', icon: Facebook, label: 'Facebook' },
  { key: 'social_whatsapp', icon: WhatsAppIcon, label: 'WhatsApp Community' },
  { key: 'social_github', icon: Github, label: 'GitHub' },
  { key: 'social_discord', icon: DiscordIcon, label: 'Discord' },
  { key: 'social_telegram', icon: TelegramIcon, label: 'Telegram' },
] as const;

export function Footer({ settings = {} }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const email = settings.contact_email;
  const phone = settings.contact_phone;
  const address = settings.address;
  const footerText = settings.footer_text || siteConfig.description;
  const copyright =
    settings.copyright_text || `© ${currentYear} ${siteConfig.name}. All rights reserved.`;
  const socials = socialConfig.filter((item) => Boolean(settings[item.key]));

  return (
    <footer className="bg-[#0A0F1C] text-slate-300 relative border-t border-slate-800 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-violet-600 opacity-80" />

      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden bg-white shadow-lg ring-2 ring-white/20 shrink-0 p-1 group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo.png"
                  alt="Youth Empowerment Hub Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight leading-tight flex items-center gap-1.5">
                  <span className="text-[#0284C7]">Youth</span>
                  <span className="text-[#F97316]">Empowerment Hub</span>
                </span>
                <span className="text-[11px] font-bold text-slate-300 tracking-wider uppercase mt-1 flex items-center gap-1.5">
                  <span>Learn</span>
                  <span className="w-1 h-1 rounded-full bg-[#0284C7]" />
                  <span>Innovate</span>
                  <span className="w-1 h-1 rounded-full bg-[#F97316]" />
                  <span>Grow</span>
                </span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 pr-4">{footerText}</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Ecosystem Portals</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/opportunities" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  Opportunities Portal
                </Link>
              </li>
              <li>
                <Link href="/platforms" className="hover:text-blue-400 transition-colors">
                  Integrated Platforms
                </Link>
              </li>
              <li>
                <Link href="/initiatives" className="hover:text-blue-400 transition-colors">
                  Initiatives & Projects
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-blue-400 transition-colors">
                  Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  Event Gallery & Glimpses
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors">
                  About the Organisation
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Get Involved</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/get-involved" className="hover:text-blue-400 transition-colors">
                  Ways to contribute
                </Link>
              </li>
              <li>
                <Link href="/contact?category=Volunteering" className="hover:text-blue-400 transition-colors">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/contact?category=Partnership" className="hover:text-blue-400 transition-colors">
                  Partner with us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Connect</h3>
            <ul className="space-y-4 text-sm">
              {email ? (
                <li className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-cyan-400 shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors break-all">
                    {email}
                  </a>
                </li>
              ) : null}
              {phone ? (
                <li className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-cyan-400 shrink-0" />
                  <a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-white transition-colors">
                    {phone}
                  </a>
                </li>
              ) : null}
              {address ? (
                <li className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{address}</span>
                </li>
              ) : null}
              {!email && !phone && !address ? (
                <li>
                  <Link href="/contact" className="hover:text-blue-400 transition-colors">
                    Reach us through the contact form
                  </Link>
                </li>
              ) : null}
            </ul>

            {socials.length > 0 ? (
              <div className="pt-2 flex items-center flex-wrap gap-3">
                {socials.map(({ key, icon: Icon, label }) => (
                  <a
                    key={key}
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800/80 bg-[#070B14]">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{copyright}</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
