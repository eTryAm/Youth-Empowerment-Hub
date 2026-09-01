import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Home, Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#0A0F1C] text-white px-4 py-16 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 mesh-bg opacity-30 mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-600/20 via-orange-600/15 to-violet-600/20 rounded-full blur-3xl pointer-events-none" />

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

        {/* 404 Code Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-orange-500/15 border border-orange-400/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" /> Page Not Found
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
          404 Error
        </h1>

        <p className="text-slate-300 text-base leading-relaxed">
          The page you are looking for might have been moved, renamed, or is temporarily unavailable. Let&apos;s get you back to the ecosystem.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold shadow-lg shadow-blue-500/20"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              <span>Back to Homepage</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto h-12 px-6 rounded-2xl border-white/20 bg-white/5 hover:bg-white/10 text-slate-200 font-bold backdrop-blur-md"
          >
            <Link href="/platforms" className="flex items-center gap-2">
              <Compass className="w-4 h-4" />
              <span>Explore Platforms</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}