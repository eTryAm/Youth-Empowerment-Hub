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
      <DialogContent className="max-w-lg w-[94vw] sm:w-full bg-[#0A0F1C] border border-white/15 text-white rounded-3xl p-5 sm:p-7 shadow-2xl z-50 max-h-[88vh] overflow-y-auto">
        <DialogHeader className="space-y-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0284C7] via-[#2563EB] to-[#F97316] text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/15 border border-orange-400/30 text-orange-400 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Coming Soon
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-black text-white leading-tight mt-1">
                Razorpay Payment Gateway
              </DialogTitle>
            </div>
          </div>
          
          <DialogDescription className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            We are currently finalizing our official <strong>Razorpay 80G Tax-Exempt NGO Gateway</strong> for instant UPI (GPay, PhonePe, Paytm), Cards, and Netbanking contributions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-1">
          {/* Selected Impact Allocation Card */}
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-orange-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-orange-400 text-orange-400" /> Selected Impact
              </span>
              <span className="text-[#F97316] font-black text-base sm:text-lg">{selectedAmount}</span>
            </div>
            <div className="text-sm font-bold text-white">
              {selectedTitle}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {selectedDescription}
            </p>
          </div>

          {/* Email Notification Form */}
          {!isNotified ? (
            <form onSubmit={handleNotifySubmit} className="space-y-2.5 p-4 rounded-2xl bg-blue-950/20 border border-blue-500/20">
              <label className="text-xs font-semibold text-slate-200 block">
                Get notified the moment our Razorpay gateway is live:
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/15 text-white placeholder:text-slate-500 rounded-xl text-xs sm:text-sm h-10 sm:h-11 flex-1"
                />
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-[#0284C7] to-[#F97316] hover:opacity-90 text-white font-bold h-10 sm:h-11 px-4 rounded-xl shrink-0 cursor-pointer shadow-md text-xs sm:text-sm"
                >
                  Notify Me
                </Button>
              </div>
            </form>
          ) : (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>You will receive an update as soon as Razorpay payments are live!</span>
            </div>
          )}

          {/* Institutional / CSR Sponsor CTA */}
          <div className="pt-2 border-t border-white/10 text-center space-y-2">
            <p className="text-xs text-slate-400">
              Representing a company or seeking direct CSR sponsorship, hackathon grants, or lab hardware backing today?
            </p>
            <Button
              asChild
              variant="outline"
              className="w-full rounded-xl border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/10 font-bold h-10 sm:h-11 text-xs sm:text-sm cursor-pointer"
            >
              <Link href="/contact?category=Partnership" onClick={onClose}>
                Connect for Institutional / CSR Backing &rarr;
              </Link>
            </Button>
          </div>

          {/* Security Badges */}
          <div className="pt-1 flex items-center justify-center gap-4 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Non-Profit
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-blue-400" /> 256-Bit SSL Encrypted
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}