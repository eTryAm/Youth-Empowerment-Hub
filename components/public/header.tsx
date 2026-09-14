'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn, isNavActive } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/public/mobile-nav';
import { NotificationsPopover, type NotificationItem } from '@/components/public/notifications-popover';
import { DonationModal } from '@/components/public/donation-modal';

interface HeaderProps {
  navItems?: { label: string; url: string }[];
  siteName?: string;
  notifications?: NotificationItem[];
}

export function Header({ 
  navItems = [], 
  siteName = 'Youth Empowerment Hub',
  notifications = [] 
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const pathname = usePathname();
  const primaryNav = navItems.filter((item) => item.url !== '/get-involved');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 flex items-center transition-all duration-300 w-full',
        scrolled
          ? 'h-16 bg-white/95 shadow-md backdrop-blur-xl border-b border-slate-200/80'
          : 'h-16 sm:h-18 md:h-20 bg-white/90 backdrop-blur-md border-b border-slate-200/60'
      )}
    >
      <div className="container-custom flex w-full items-center justify-between gap-3 sm:gap-4">
        {/* Brand Link — Logo & Organisation Name in ONE Line Always */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 shrink-0 z-50 group py-1" aria-label={`${siteName} home`}>
          {/* Logo Badge */}
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-xl sm:rounded-2xl overflow-hidden bg-white p-0.5 sm:p-1 shadow-sm ring-1 ring-slate-200 shrink-0 group-hover:scale-105 transition-all">
            <Image
              src="/images/logo.png"
              alt="Youth Empowerment Hub Logo"
              fill
              className="object-contain p-0.5"
              priority
            />
          </div>

          {/* Organisation Name in ONE LINE */}
          <div className="flex flex-col justify-center shrink-0">
            <span className="text-base sm:text-lg md:text-xl font-black tracking-tight leading-tight whitespace-nowrap flex items-center gap-1.5">
              <span className="text-[#0284C7]">Youth</span>
              <span className="text-[#F97316]">Empowerment Hub</span>
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 tracking-wider uppercase mt-0.5 whitespace-nowrap hidden sm:flex items-center gap-1.5">
              <span>Learn</span>
              <span className="w-1 h-1 rounded-full bg-[#0284C7]" />
              <span>Innovate</span>
              <span className="w-1 h-1 rounded-full bg-[#F97316]" />
              <span>Grow</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation (Visible on lg/xl screens) */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 shrink-0" aria-label="Primary">
          {primaryNav.map((item) => {
            const isActive = isNavActive(pathname, item.url);
            return (
              <Link
                key={item.url}
                href={item.url}
                className={cn(
                  'text-xs xl:text-sm font-semibold transition-colors relative py-1.5 px-2.5 xl:px-3 rounded-xl whitespace-nowrap',
                  isActive ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full" />
                )}
              </Link>
            );
          })}

          
          <NotificationsPopover notifications={notifications} />

          {/* Desktop Hovering / Pulsing Donate Button */}
          <motion.button
            type="button"
            onClick={() => setIsDonationOpen(true)}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(249, 115, 22, 0.4)',
                '0 0 0 8px rgba(249, 115, 22, 0)',
                '0 0 0 0 rgba(249, 115, 22, 0.4)',
              ],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="ml-1 px-3.5 xl:px-4 py-1.5 xl:py-2 rounded-full bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#E11D48] text-white font-extrabold text-xs xl:text-sm shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center gap-1.5 cursor-pointer border border-white/20 shrink-0 whitespace-nowrap"
          >
            <span>Donate</span>
            <span className="text-sm">❤️</span>
          </motion.button>

          <Button
            asChild
            className="ml-1 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 border-0 shadow-md text-white font-semibold text-xs xl:text-sm px-3.5 xl:px-4.5 py-1.5 shrink-0 whitespace-nowrap"
          >
            <Link href="/get-involved">Join the Initiative</Link>
          </Button>

        </nav>

        {/* Mobile Header: ONLY Notification Bell + Hamburger (Donate is inside Hamburger) */}
        <div className="lg:hidden flex items-center gap-2 shrink-0">
          <NotificationsPopover notifications={notifications} />
          <MobileNav navItems={navItems} siteName={siteName} />
        </div>
      </div>

      {/* Desktop Donation Modal */}
      <DonationModal
        isOpen={isDonationOpen}
        onClose={() => setIsDonationOpen(false)}
      />
    </header>
  );
}