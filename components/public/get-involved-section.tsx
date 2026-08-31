import { Handshake, Building2, GraduationCap, Users2, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function GetInvolvedSection() {
  return (
    <section className="py-16 md:py-20 bg-white relative">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <Badge variant="outline" className="border-blue-400/30 bg-blue-500/10 text-blue-300">
                  Institutional & Industry Collaboration
                </Badge>
                
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Partner With Us
                </h2>
                
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  We collaborate with educational institutions, technology organizations, corporations, and community foundations to deliver scalable opportunities, mentorship cohorts, and skill programs to youth.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-3.5">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 h-13 rounded-2xl shadow-lg shadow-blue-500/25 border-0">
                    <Link href="/contact?category=Partnership">
                      <Handshake className="w-5 h-5 mr-2" />
                      Initiate a Partnership
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-5 grid sm:grid-cols-2 gap-3.5">
                {[
                  {
                    icon: Building2,
                    title: 'Corporate Alliances',
                    desc: 'Host internships & mentorship tracks',
                  },
                  {
                    icon: GraduationCap,
                    title: 'Academic Partners',
                    desc: 'Colleges, schools & research labs',
                  },
                  {
                    icon: Users2,
                    title: 'Community NGOs',
                    desc: 'Grassroots welfare & skill outreach',
                  },
                  {
                    icon: ShieldCheck,
                    title: 'Certified Programs',
                    desc: 'Co-branded badges & career tracks',
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold mb-2.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}