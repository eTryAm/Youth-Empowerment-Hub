'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#0A0F1C] text-white px-4 py-16 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 mesh-bg opacity-30 mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-red-600/20 via-orange-600/15 to-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg mx-auto text-center space-y-6">
        {/* Brand Emblem */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl overflow-hidden bg-white shadow-2xl ring-2 ring-white/20 mx-auto p-1.5 hover:scale-105 transition-transform">
          <Image
            src="/images/logo.png"
            alt="Youth Empowerment Hub Logo"
            fill
            className="object-contain p-1"
            priority
          />
        </div>

        {/* Error Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-400/30 text-rose-400 text-xs font-bold uppercase tracking-wider">
          <AlertTriangle className="w-3.5 h-3.5" /> Temporary System Notice
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Something went wrong
        </h1>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          We encountered an unexpected issue while rendering this view. You can try refreshing the page or navigating back to the home portal.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            <span>Try Again</span>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto h-12 px-6 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 font-bold backdrop-blur-md"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Back to Homepage</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}