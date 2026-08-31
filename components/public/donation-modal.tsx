'use client';

import { useState } from 'react';
import { 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  ShieldCheck, 
  Building2, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAmount?: string;
  selectedTitle?: string;
  selectedDescription?: string;
}

export function DonationModal({
  isOpen,
  onClose,
  selectedAmount = '₹2,500',
  selectedTitle = 'Youth Empowerment Impact Pledge',
  selectedDescription = 'Directly fuels hands-on student robotics kits, hackathon scholarships, and rural digital literacy hubs.',
}: DonationModalProps) {
  const [notifyEmail, setNotifyEmail] = useState('');
  const [isNotified, setIsNotified] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setIsNotified(true);
    toast.success("Thank you! You'll receive instant notification when our Razorpay gateway goes live.");
    setTimeout(() => {
      onClose();
      setIsNotified(false);
      setNotifyEmail('');
    }, 2200);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-[92vw] bg-[#0A0F1C] border border-white/15 text-white rounded-3xl p-6 sm:p-8 shadow-2xl z-50">
        <DialogHeader className="space-y-3 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0284C7] via-[#2563EB] to-[#F97316] text-white flex items-center justify-center mx-auto sm:mx-0 shadow-lg shadow-blue-500/20">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-black text-white leading-tight">
              Razorpay Payment Gateway Coming Soon!
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-sm mt-1">
              We are currently finalizing our official **Razorpay 80G Tax-Exempt NGO Gateway** for instant UPI, Debit/Credit Cards, and Netbanking support.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-5 my-2">
          {/* Selected Impact Card */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
            <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Targeted Impact Allocation
            </div>
            <div className="text-lg font-black text-white flex items-center justify-between">
              <span>{selectedTitle}</span>
              <span className="text-[#F97316] font-extrabold">{selectedAmount}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {selectedDescription}
            </p>
          </div>

          {/* Email Notification signup */}
          {!isNotified ? (
            <form onSubmit={handleNotifySubmit} className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 block">
                Get notified the moment our Razorpay gateway is activated:
              </label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/15 text-white placeholder:text-slate-500 rounded-xl text-sm h-11"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#0284C7] to-[#F97316] hover:opacity-90 text-white font-bold h-11 px-4 rounded-xl shrink-0 cursor-pointer shadow-md"
                >
                  Notify Me
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>You will receive an update as soon as Razorpay payments are live!</span>
            </div>
          )}

          {/* Institutional / CSR Sponsor CTA */}
          <div className="pt-2 border-t border-white/10 text-center">
            <p className="text-xs text-slate-400 mb-3">
              Representing a company or looking for direct CSR sponsorship, hackathon grants, or device donations today?
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full rounded-xl border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/10 font-bold h-11 cursor-pointer"
            >
              <Link href="/contact?category=Partnership" onClick={onClose}>
                Connect for Institutional / CSR Backing &rarr;
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}