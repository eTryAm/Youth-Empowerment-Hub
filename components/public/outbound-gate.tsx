'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn, isExternalHref } from '@/lib/utils';

type OutboundGateProps = {
  title: string;
  description?: string | null;
  href?: string | null;
  fallbackHref: string;
  urlType?: string | null;
  ctaLabel?: string;
  className?: string;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
};

const CHECKLIST = [
  'Have your basic contact details ready',
  'Share only information you are comfortable providing',
  'Review the destination before submitting anything',
];

export function OutboundGate({
  title,
  description,
  href,
  fallbackHref,
  urlType,
  ctaLabel = 'Get Started',
  className,
  variant = 'default',
}: OutboundGateProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const destination = href?.trim() || fallbackHref;
  const leavesSite = isExternalHref(destination) || urlType === 'external' || urlType === 'google_form';

  function continueToDestination() {
    setOpen(false);
    if (leavesSite) {
      window.open(destination, '_blank', 'noopener,noreferrer');
      return;
    }
    router.push(destination);
  }

  return (
    <>
      <Button type="button" variant={variant} className={cn('w-full', className)} onClick={() => setOpen(true)}>
        {ctaLabel}
        <ExternalLink className="ml-2 h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">You are about to begin {title}</DialogTitle>
            <DialogDescription className="text-base text-slate-600">
              {description ||
                'Take a moment to confirm this is the right next step before continuing.'}
            </DialogDescription>
          </DialogHeader>

          <ul className="space-y-3 py-2">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {leavesSite ? (
            <p className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-600">
              This step continues on an external page. You can return here at any time.
            </p>
          ) : (
            <p className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-slate-600">
              We will keep you on Youth Empowerment Hub to complete the next step.
            </p>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Stay here
            </Button>
            <Button type="button" onClick={continueToDestination}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
