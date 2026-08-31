'use client';

import { useState } from 'react';
import { 
  Briefcase, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Globe,
  Rocket,
  Clock,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface OpportunitiesGatewayViewProps {
  platformUrl?: string | null;
  platformName?: string;
  platformDescription?: string | null;
}

export function OpportunitiesGatewayView({
  platformUrl,
  platformName = 'Opportunities Platform',
  platformDescription,
}: OpportunitiesGatewayViewProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const rawUrl = platformUrl?.trim() || '';
  const hasValidExternalUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://');

  const handleLaunch = () => {
    if (hasValidExternalUrl) {
      window.open(rawUrl, '_blank', 'noopener,noreferrer');
    } else {
      setShowComingSoon(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden">
        {showComingSoon ? (
          /* ========================================================
             BEAUTIFUL COMING SOON DIALOG ON /OPPORTUNITIES
             ======================================================== */
          <div className="p-8 sm:p-14 text-center flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30">
                <Rocket className="w-10 h-10 animate-bounce" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-slate-900 shadow">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-2 max-w-md">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Opportunities Platform Launching Soon
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Live Deployment In Final Stages
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                The independent <strong>Opportunities Platform</strong> hosting all application forms, job listings, and scholarship registers will be linked here as soon as deployment finishes.
              </p>
            </div>

            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left grid sm:grid-cols-2 gap-3 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Independent Application Forms</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Verified Corporate Internships</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>Higher Education Grants</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-violet-500" />
                <span>Direct Recruiter Review</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 w-full justify-center">
              <Button
                onClick={() => setShowComingSoon(false)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 px-6 rounded-2xl shadow-md cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Overview
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-slate-200 text-slate-700 h-12 px-6 rounded-2xl font-semibold"
              >
                <Link href="/platforms">View All Platforms</Link>
              </Button>
            </div>
          </div>
        ) : (
          /* ========================================================
             GATEWAY OVERVIEW & GO TO SITE ACTION
             ======================================================== */
          <>
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-8 sm:p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                  Primary Organization Platform
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {platformName}
                </h1>

                <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                  {platformDescription ||
                    'All opportunity listings, internship applications, scholarship registrations, and youth career forms are hosted and managed directly on our dedicated Opportunities Platform.'}
                </p>
              </div>
            </div>

            <div className="p-8 sm:p-12 space-y-8 bg-white">
              {/* Features / Capabilities List */}
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Explore verified internships and career pathways',
                  'Direct online application forms & status tracking',
                  'Apply for higher education grants and scholarships',
                  'Skill bootcamps, workshops, and mentorship cohorts',
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                  >
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm font-medium leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons — Direct "Go to Site", ZERO ACCESS FORMS */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <Button
                  onClick={handleLaunch}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-10 h-14 rounded-2xl shadow-xl shadow-blue-500/20 border-0 text-base transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  <span>Go to Site</span>
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-2xl h-14 border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                >
                  <Link href="/platforms">
                    <Globe className="w-4 h-4 mr-2" />
                    View All Platforms
                  </Link>
                </Button>
              </div>

              {/* Security & Authenticity Notice */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-blue-900 text-xs sm:text-sm">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <span>
                  This central hub acts as the single verified gateway. Platform links and destinations are configured and maintained through the central admin panel.
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}