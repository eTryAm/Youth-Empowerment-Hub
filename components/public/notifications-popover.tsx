'use client';

import { useState } from 'react';
import { Bell, Megaphone, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export interface NotificationItem {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  date?: Date | string | null;
  externalUrl?: string | null;
  featured?: boolean | null;
}

interface NotificationsPopoverProps {
  notifications?: NotificationItem[];
}

export function NotificationsPopover({ notifications = [] }: NotificationsPopoverProps) {
  const [open, setOpen] = useState(false);
  const count = notifications.length;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-all focus:outline-none cursor-pointer flex items-center justify-center"
          aria-label={`View notifications (${count} available)`}
        >
          <Bell className="w-5 h-5 transition-transform hover:rotate-12" />
          {count > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-[9px] font-black text-slate-950 items-center justify-center shadow-sm">
                {count > 9 ? '9+' : count}
              </span>
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-80 sm:w-96 p-0 bg-white border border-slate-200 text-slate-900 shadow-2xl rounded-3xl overflow-hidden z-50 animate-in fade-in-0 zoom-in-95"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base leading-none">Notifications & Alerts</h4>
              <p className="text-xs text-slate-400 mt-1">Official announcements & updates</p>
            </div>
          </div>
          {count > 0 && (
            <Badge className="bg-blue-600 text-white hover:bg-blue-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {count} New
            </Badge>
          )}
        </div>

        {/* List Content */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 p-2">
          {count > 0 ? (
            notifications.map((item) => {
              const itemDate = item.date ? new Date(item.date) : null;
              return (
                <div
                  key={item.id}
                  className="p-3.5 hover:bg-slate-50/80 rounded-2xl transition-colors space-y-2 group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.category ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          {item.category}
                        </span>
                      ) : null}
                      {item.featured ? (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                          Featured
                        </span>
                      ) : null}
                    </div>
                    {itemDate ? (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {format(itemDate, 'MMM d')}
                      </span>
                    ) : null}
                  </div>

                  <h5 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors break-words">
                    {item.title}
                  </h5>

                  {item.description ? (
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 break-words">
                      {item.description}
                    </p>
                  ) : null}

                  {item.externalUrl ? (
                    <div className="pt-1">
                      <Link
                        href={item.externalUrl}
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
                      >
                        <span>Open Details</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 text-slate-300 mx-auto stroke-1" />
              <p className="font-semibold text-slate-700 text-sm">No new notifications</p>
              <p className="text-xs text-slate-400">You're all caught up with latest updates.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Youth Empowerment Hub</span>
          <Link
            href="/events"
            onClick={() => setOpen(false)}
            className="font-bold text-blue-600 hover:text-blue-700"
          >
            Explore Events →
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}