'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Layers, 
  Calendar, 
  Rocket, 
  Target, 
  Megaphone,
  MessageSquare,
  Handshake,
  Heart,
  Globe,
  Mail,
  Image as ImageIcon,
  Home,
  Settings,
  Users,
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';

interface SidebarProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    avatarUrl: string | null;
  };
}

const navGroups = [
  {
    label: 'CONTENT',
    items: [
      { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { name: 'Platforms', href: '/admin/platforms', icon: Layers },
      { name: 'Events', href: '/admin/events', icon: Calendar },
      { name: 'Initiatives', href: '/admin/initiatives', icon: Rocket },
      { name: 'Objectives', href: '/admin/objectives', icon: Target },
      { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
      { name: 'Gallery & Glimpses', href: '/admin/gallery', icon: ImageIcon },
    ]
  },
  {
    label: 'ENGAGEMENT',
    items: [
      { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
      { name: 'Partners', href: '/admin/partners', icon: Handshake },
      { name: 'Impact', href: '/admin/impact', icon: Heart },
      { name: 'Get Involved', href: '/admin/get-involved', icon: Globe },
      { name: 'Contact', href: '/admin/contact', icon: Mail },
    ]
  },
  {
    label: 'SYSTEM',
    items: [
      { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
      { name: 'Homepage', href: '/admin/homepage', icon: Home },
      { name: 'Settings', href: '/admin/settings', icon: Settings },
      { name: 'Users', href: '/admin/users', icon: Users },
      { name: 'Audit Log', href: '/admin/audit', icon: FileText },
    ]
  }
];

export function AdminSidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-[#0A0F1C] text-white p-3 rounded-full shadow-lg cursor-pointer"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu size={24} />
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 flex flex-col bg-[#0A0F1C] text-slate-300 transition-all duration-300 ease-in-out border-r border-slate-800",
          isCollapsed ? "w-[72px]" : "w-[260px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800 bg-[#0A0F1C] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
            <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-white shrink-0 p-1 shadow-md ring-1 ring-white/20">
              <Image
                src="/images/logo.png"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-black text-sm tracking-tight leading-tight flex items-center gap-1">
                  <span className="text-[#0284C7]">Youth</span>
                  <span className="text-[#F97316]">Empowerment</span>
                </span>
                <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Admin Portal</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          {navGroups.map((group, groupIndex) => (
            <div key={group.label} className={cn("mb-6", isCollapsed ? "px-2" : "px-4")}>
              {!isCollapsed && (
                <div className="text-xs font-semibold text-slate-500 mb-2 tracking-wider px-2">
                  {group.label}
                </div>
              )}
              {isCollapsed && groupIndex > 0 && <div className="h-px bg-slate-800 my-4 mx-2" />}
              
              <ul className="space-y-1 relative">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.name} className="relative group">
                      <Link 
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group",
                          isActive 
                            ? "bg-white/10 text-white" 
                            : "hover:bg-white/5 text-slate-400 hover:text-white"
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#3B82F6] rounded-r-md" />
                        )}
                        <item.icon size={20} className={cn("shrink-0", isActive ? "text-[#3B82F6]" : "text-slate-400 group-hover:text-slate-300")} />
                        
                        {!isCollapsed && (
                          <span className="text-sm font-medium">{item.name}</span>
                        )}
                      </Link>
                      
                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1.5 bg-slate-800 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                          {item.name}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Collapse Toggle */}
        <div className="p-4 border-t border-slate-800 hidden lg:flex justify-end shrink-0">
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </aside>
    </>
  );
}
