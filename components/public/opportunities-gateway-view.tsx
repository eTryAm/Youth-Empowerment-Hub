'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  MapPin, 
  Users, 
  Trophy, 
  Globe, 
  Sparkles, 
  Gift, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  HeartHandshake, 
  Medal, 
  Ticket, 
  Flame, 
  Phone, 
  Mail, 
  User, 
  Building, 
  Send,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { validateSubmission } from '@/lib/actions/contact';

const OPPORTUNITY_TRACKS = [
  {
    id: 'campus-ambassador',
    title: 'Want to Become Campus Ambassador?',
    tagline: 'Lead Your College or University Chapter',
    description: 'Be the official voice of Youth Empowerment Hub on your campus. Spearhead tech hackathons, innovation workshops, coding clubs, and student networking.',
    badge: '🔥 Highest Impact on Campus',
    icon: GraduationCap,
    gradient: 'from-blue-600 via-indigo-600 to-blue-700',
    perks: [
      'Official Campus Ambassador Swag Kit & ID',
      'Letter of Recommendation (LOR) & Certificate',
      'Direct event sponsorship & funding budget',
      'Exclusive 1-on-1 industry mentorship',
    ],
  },
  {
    id: 'state-district-lead',
    title: 'Represent Your State & District',
    tagline: 'Regional Youth Leadership & Coordination',
    description: 'Lead grassroots youth mobilization across your home state and district. Connect local schools, colleges, and rural talent with national opportunities and summits.',
    badge: '🏛️ Regional Leadership',
    icon: MapPin,
    gradient: 'from-orange-500 via-amber-600 to-rose-600',
    perks: [
      'Official State/District Youth Representative Accreditation',
      'Coordinate regional summits & exhibitions',
      'Direct channel with state directors and partners',
      'Travel and logistics support for regional programs',
    ],
  },
  {
    id: 'event-volunteer',
    title: 'Volunteer in Events & Flagship Summits',
    tagline: 'Hands-on Organizing & Stage Operations',
    description: 'Work behind the scenes at national youth conventions, keynote tech summits, student hackathons, and exhibitions alongside prominent dignitaries and innovators.',
    badge: '🤝 Event Operations',
    icon: Users,
    gradient: 'from-emerald-500 via-teal-600 to-emerald-700',
    perks: [
      'VIP All-Access Passes to flagship summits',
      'Verified Certificate of Volunteering & Excellence',
      'High-profile networking with keynote speakers',
      'Exclusive event volunteer merchandise',
    ],
  },
  {
    id: 'sports-organizer',
    title: 'Organising Sports & Tournaments',
    tagline: 'Youth Athletics, Cricket & Fitness Leagues',
    description: 'Lead grassroots sports tournaments, cricket leagues, athletic meetups, and fitness challenges fostering sportsmanship, youth health, and athletic discipline.',
    badge: '🏆 Sports & Tournaments',
    icon: Trophy,
    gradient: 'from-purple-600 via-violet-600 to-indigo-700',
    perks: [
      'Tournament organizer accreditation & gear',
      'Sports equipment and trophy sponsorships',
      'Certificate of Sports Management & Leadership',
      'Feature match highlights on the live hub',
    ],
  },
  {
    id: 'community-member',
    title: 'Want to Be Part of the Community?',
    tagline: 'Connect, Collaborate & Build with Peers',
    description: 'Join thousands of student coders, creators, athletes, and changemakers across India. Collaborate on hackathons, share resources, and accelerate your growth.',
    badge: '🌐 Open to All Youth',
    icon: Globe,
    gradient: 'from-cyan-600 via-blue-600 to-teal-600',
    perks: [
      'Access to exclusive digital lounges & skill labs',
      'Hackathon team matching and project collabs',
      'Early access to internship and grant alerts',
      'Community peer reviews and project showcases',
    ],
  },
];

const REWARDS_AND_GOODIES = [
  {
    title: 'Official Swag Kit & Merch',
    desc: 'Premium branded T-Shirts, Hoodies, Notebooks, ID Badges, and Sticker Packs.',
    icon: Gift,
    badge: 'Exclusive Apparel',
    color: 'from-orange-500 to-amber-500',
  },
  {
    title: 'Verified Certificate & LOR',
    desc: 'Official Certificate of Leadership & Letter of Recommendation for LinkedIn and job resumes.',
    icon: Award,
    badge: 'Career Boost',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Performance Stipends & Grants',
    desc: 'Sponsored performance rewards, event execution budgets, and project funding.',
    icon: Sparkles,
    badge: 'Funded Support',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    title: '1-on-1 Leadership Mentorship',
    desc: 'Direct career guidance from tech startup founders, CXOs, and industry veterans.',
    icon: HeartHandshake,
    badge: 'Network Access',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    title: 'VIP Summit & Hackathon Passes',
    desc: 'Complimentary VIP access to national youth conventions and keynote conferences.',
    icon: Ticket,
    badge: 'All-Access Pass',
    color: 'from-rose-500 to-pink-500',
  },
  {
    title: 'National Leadership Awards',
    desc: 'Annual trophies and nationwide honors presented on stage at the Youth Empowerment Summit.',
    icon: Medal,
    badge: 'Annual Recognition',
    color: 'from-amber-500 to-yellow-500',
  },
];

export function OpportunitiesGatewayView() {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    institution: '',
    track: 'Campus Ambassador',
    message: '',
  });

  const handleOpenApplication = (trackTitle: string) => {
    setSelectedTrack(trackTitle);
    setFormData((prev) => ({ ...prev, track: trackTitle }));
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in your name, email, and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await validateSubmission({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: `Application: ${formData.track} — ${formData.location || 'India'}`,
        category: 'Opportunities',
        message: `Role/Track: ${formData.track}\nCollege/Organization: ${formData.institution || 'N/A'}\nState/District: ${formData.location || 'N/A'}\nNotes: ${formData.message || 'Ready to contribute'}`,
      });

      if (res.success) {
        toast.success(`🎉 Congratulations! Your application for "${formData.track}" has been received. Our team will contact you on WhatsApp/Email.`);
        setIsModalOpen(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          location: '',
          institution: '',
          track: 'Campus Ambassador',
          message: '',
        });
      } else {
        toast.error(res.error || 'Failed to submit application. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 max-w-6xl mx-auto w-full">
      {/* ========================================================
         HERO INTRO BANNER
         ======================================================== */}
      <div className="text-center max-w-3xl mx-auto space-y-4 px-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/15 via-orange-500/15 to-rose-500/15 border border-blue-400/30 text-blue-600 text-xs font-black uppercase tracking-wider shadow-sm">
          <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
          Youth Leadership, Campus Roles & Community Tracks
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
          Shape the Future. <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-[#F97316]">
            Lead the Movement.
          </span>
        </h1>

        <p className="text-slate-600 text-sm sm:text-base md:text-lg leading-relaxed">
          Step up as a changemaker in India&apos;s most dynamic youth ecosystem. Whether on your campus, across your district, or in national flagship events — explore opportunities that accelerate your career and reward your dedication.
        </p>
      </div>

      {/* ========================================================
         THE 5 CORE OPPORTUNITY TRACKS
         ======================================================== */}
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Featured Opportunity Tracks
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Select a leadership track to register and receive official recognition.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            5 Active Tracks Open for Applications
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {OPPORTUNITY_TRACKS.map((track, idx) => {
            const Icon = track.icon;
            const isFullWidth = idx === 4; // Community Member is full width on desktop

            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`group relative rounded-3xl bg-white border border-slate-200/90 hover:border-blue-300 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                  isFullWidth ? 'md:col-span-2' : ''
                }`}
              >
                {/* Background Accent Gradient Beam */}
                <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${track.gradient} opacity-[0.04] rounded-full blur-2xl pointer-events-none group-hover:opacity-[0.08] transition-opacity`} />

                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${track.gradient} p-3 text-white flex items-center justify-center shadow-lg shadow-blue-500/15 group-hover:scale-105 transition-transform shrink-0`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wide bg-slate-100 text-slate-700 border border-slate-200/80">
                      {track.badge}
                    </span>
                  </div>

                  {/* Title & Descriptions */}
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
                    {track.title}
                  </h3>
                  
                  <div className="text-xs font-bold text-orange-600 uppercase tracking-wider mt-1 mb-3">
                    {track.tagline}
                  </div>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {track.description}
                  </p>

                  {/* Key Perks List */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      What You Receive:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {track.perks.map((perk, perkIdx) => (
                        <div key={perkIdx} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="pt-2">
                  <Button
                    onClick={() => handleOpenApplication(track.title)}
                    className="w-full h-12 rounded-2xl bg-slate-900 hover:bg-gradient-to-r hover:from-blue-600 hover:to-[#F97316] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer group-hover:shadow-lg"
                  >
                    <span>Apply for {track.title.replace('?', '')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
         REWARDS & GOODIES SHOWCASE SECTION
         ======================================================== */}
      <div className="rounded-3xl bg-[#0A0F1C] text-white p-6 sm:p-10 md:p-14 relative overflow-hidden border border-white/10 shadow-2xl">
        {/* Background Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-orange-600/15 via-rose-600/15 to-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />

        <div className="relative z-10 space-y-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-400/30 text-orange-400 text-xs font-black uppercase tracking-wider">
              <Gift className="w-4 h-4 text-orange-400 animate-bounce" />
              Exciting Rewards, Goodies & Perks
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Honoring Your Leadership & Impact
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              We reward, celebrate, and empower our ambassadors, organizers, and volunteers with tangible perks that boost career credentials and recognize grassroots dedication.
            </p>
          </div>

          {/* 6 Rewards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {REWARDS_AND_GOODIES.map((reward, rIdx) => {
              const Icon = reward.icon;
              return (
                <div
                  key={rIdx}
                  className="rounded-2xl p-5 bg-white/[0.04] border border-white/10 hover:border-orange-400/40 hover:bg-white/[0.07] transition-all duration-300 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${reward.color} p-2.5 text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-orange-300 border border-white/15">
                      {reward.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white mb-1 leading-snug">
                      {reward.title}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {reward.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-orange-950/40 border border-white/15 text-center flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="text-left space-y-1">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400 shrink-0" />
                Ready to Claim Your Leadership Track?
              </h4>
              <p className="text-xs text-slate-300">
                Registrations are currently open for all college, state, and event positions across India.
              </p>
            </div>

            <Button
              onClick={() => handleOpenApplication('Campus Ambassador')}
              className="w-full sm:w-auto px-8 h-12 rounded-xl bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#E11D48] hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-orange-500/25 shrink-0 cursor-pointer"
            >
              <span>Join as Leader / Volunteer</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* ========================================================
         INTERACTIVE APPLICATION MODAL
         ======================================================== */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg w-[94vw] sm:w-full bg-[#0A0F1C] border border-white/15 text-white rounded-3xl p-5 sm:p-7 shadow-2xl z-50 max-h-[88vh] overflow-y-auto">
          <DialogHeader className="space-y-2 text-left">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-400 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Official Application Portal
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-black text-white leading-tight">
              Apply for Leadership Track
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-xs leading-relaxed">
              Fill in your details below to register for <strong>{formData.track}</strong>. Our state and campus coordinators will review your submission promptly.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 my-2">
            {/* Select Track */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                Selected Leadership Track *
              </label>
              <select
                value={formData.track}
                onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                className="w-full h-11 px-3.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {OPPORTUNITY_TRACKS.map((t) => (
                  <option key={t.id} value={t.title.replace('?', '')} className="bg-slate-900 text-white">
                    {t.title.replace('?', '')}
                  </option>
                ))}
              </select>
            </div>

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white/5 border-white/15 text-white placeholder:text-slate-500 rounded-xl text-xs sm:text-sm h-11 pl-10"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-white/5 border-white/15 text-white placeholder:text-slate-500 rounded-xl text-xs sm:text-sm h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  WhatsApp / Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="bg-white/5 border-white/15 text-white placeholder:text-slate-500 rounded-xl text-xs sm:text-sm h-11 pl-10"
                  />
                </div>
              </div>
            </div>

            {/* State/District & College */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  State & District
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="e.g. Patna, Bihar"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-white/5 border-white/15 text-white placeholder:text-slate-500 rounded-xl text-xs sm:text-sm h-11 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">
                  College / University / School
                </label>
                <div className="relative">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="e.g. IIT Patna / DU"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="bg-white/5 border-white/15 text-white placeholder:text-slate-500 rounded-xl text-xs sm:text-sm h-11 pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <Button
                type="submit"
                disabled={submitting}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-[#F97316] text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 cursor-pointer transition-all hover:opacity-95"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Submit Application</span>
                    <Send className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}