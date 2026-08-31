import { SafeImage } from '@/components/shared/safe-image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

type Partner = {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
};

interface PartnersSectionProps {
  partners: Partner[];
}

export function PartnersSection({ partners = [] }: PartnersSectionProps) {
  if (!partners || partners.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="container-custom">
        <div className="flex flex-col items-center text-center mb-12">
          <Badge variant="outline" className="mb-4">Our Partners</Badge>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl text-slate-900">Collaborations & Partnerships</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 items-center justify-items-center opacity-80">
          {partners.map((partner) => {
            const content = (
              <div className="relative w-32 h-16 md:w-40 md:h-20 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                <SafeImage
                  src={partner.logoUrl}
                  alt={`${partner.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            );

            return partner.websiteUrl ? (
              <Link 
                key={partner.id} 
                href={partner.websiteUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                {content}
              </Link>
            ) : (
              <div key={partner.id}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
