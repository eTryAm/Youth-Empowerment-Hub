'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, Heart } from 'lucide-react';
import { cn, isNavActive } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DonationModal } from '@/components/public/donation-modal';

interface MobileNavProps {
  navItems: { label: string; url: string }[];
  siteName: string;
}

export function MobileNav({ navItems, siteName }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const pathname = usePathname();

  const handleOpenDonate = () => {
    setOpen(false);
    setIsDonationOpen(true);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 hover:text-white h-9 w-9 p-0"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[380px] flex flex-col pt-8 bg-white text-slate-900 z-50">
          <SheetHeader className="mb-6 text-left">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-2xl overflow-hidden bg-white shadow-md ring-1 ring-slate-200 shrink-0 p-1">
                <Image
                  src="/images/logo.png"
                  alt="Youth Empowerment Hub Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <SheetTitle className="text-lg font-black leading-tight flex items-center gap-1">
                  <span className="text-[#0284C7]">Youth</span>
                  <span className="text-[#F97316]">Empowerment Hub</span>
                </SheetTitle>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
                  Learn • Innovate • Grow
                </span>
              </div>
            </div>
          </SheetHeader>

          <nav className="flex-1 flex flex-col space-y-1.5 overflow-y-auto pr-1" aria-label="Mobile">
            {navItems.map((item) => {
              const isActive = isNavActive(pathname, item.url);
              return (
                <Link
                  key={item.url}
                  href={item.url}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'text-base font-bold transition-colors rounded-xl px-3.5 py-2.5 flex items-center justify-between',
                    isActive ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                  )}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 pb-6 border-t border-slate-100 flex flex-col gap-2.5">
            {/* Donate Button inside Hamburger Menu */}
            <button
              type="button"
              onClick={handleOpenDonate}
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#E11D48] hover:opacity-95 text-white font-extrabold text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <span>Donate & Support</span>
              <span>❤️</span>
            </button>

            <Button
              asChild
              className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 border-0 shadow-md text-white font-bold text-sm cursor-pointer"
            >
              <Link href="/get-involved" onClick={() => setOpen(false)}>
                Get Involved
              </Link>
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Donation Modal Triggered from Hamburger Menu */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
    </>
  );
}