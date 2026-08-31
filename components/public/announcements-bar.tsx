'use client';

import { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface AnnouncementsBarProps {
  announcement?: {
    title: string;
    description?: string;
    externalUrl?: string;
  };
}

export function AnnouncementsBar({ announcement }: AnnouncementsBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if there's an announcement and it hasn't been dismissed in this session
    if (announcement) {
      const dismissed = sessionStorage.getItem('announcement-dismissed');
      if (dismissed !== announcement.title) {
        setIsVisible(true);
      }
    }
  }, [announcement]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (announcement) {
      sessionStorage.setItem('announcement-dismissed', announcement.title);
    }
  };

  if (!announcement || !isVisible) {
    return null;
  }

  const Content = () => (
    <div className="flex items-center justify-center gap-2 text-sm font-medium text-white px-8">
      <span className="truncate">
        <strong>{announcement.title}</strong>
        {announcement.description && <span className="hidden sm:inline"> - {announcement.description}</span>}
      </span>
      {announcement.externalUrl && <ExternalLink className="w-4 h-4 shrink-0" />}
    </div>
  );

  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white z-50">
      <div className="container px-4 py-2.5 flex items-center justify-between">
        <div className="flex-1 flex justify-center overflow-hidden">
          {announcement.externalUrl ? (
            <Link href={announcement.externalUrl} className="hover:opacity-80 transition-opacity max-w-full block truncate">
              <Content />
            </Link>
          ) : (
            <Content />
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 hover:bg-white/20 rounded-md transition-colors shrink-0 absolute right-4"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}
