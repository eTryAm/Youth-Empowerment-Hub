'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Quote, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  MessageSquareHeart, 
  Send, 
  Loader2, 
  CheckCircle2, 
  User, 
  Building, 
  Award,
  Play,
  Pause
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { submitPublicTestimonial } from '@/lib/actions/testimonials';

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  designation: string;
  organization?: string;
  avatarUrl?: string;
  rating?: number;
};

interface TestimonialsSectionProps {
  testimonials?: Testimonial[];
}

export function TestimonialsSection({ testimonials = [] }: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    personName: '',
    designation: '',
    organization: '',
    testimonialText: '',
    photoUrl: '',
    rating: 5,
  });

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const count = testimonials.length;
  const slideDurationMs = 5000; // 5 seconds stay per testimonial

  // Auto-slide effect
  useEffect(() => {
    if (count <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % count);
    }, slideDurationMs);

    return () => clearInterval(timer);
  }, [count, isPaused]);

  const handleNext = () => {
    if (count > 0) {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % count);
    }
  };

  const handlePrev = () => {
    if (count > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => (prev - 1 + count) % count);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('personName', formData.personName);
      fd.append('designation', formData.designation);
      fd.append('organization', formData.organization);
      fd.append('testimonialText', formData.testimonialText);
      fd.append('rating', String(formData.rating || 5));
      if (formData.photoUrl) fd.append('photoUrl', formData.photoUrl);

      const res = await submitPublicTestimonial(fd);
      if (res.success) {
        toast.success(res.message || 'Thank you for sharing your experience!');
        setSubmitted(true);
        setTimeout(() => {
          setIsModalOpen(false);
          setSubmitted(false);
          setFormData({
            personName: '',
            designation: '',
            organization: '',
            testimonialText: '',
            photoUrl: '',
            rating: 5,
          });
        }, 1800);
      } else {
        const errMsg = typeof res.error === 'object' && res.error !== null
          ? Object.entries(res.error).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; ')
          : String(res.error || 'Failed to submit testimonial');
        toast.error(errMsg);
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const current = testimonials[currentIndex] || testimonials[0];
  const currentRating = current?.rating ?? 5;

  const ratingLabels: Record<number, string> = {
    1: '1 Star - Needs Improvement',
    2: '2 Stars - Fair Experience',
    3: '3 Stars - Good & Helpful',
    4: '4 Stars - Very Good & Impactful',
    5: '5 Stars - Outstanding & Inspiring!'
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-slate-50/60 to-white border-t border-slate-200/60 overflow-hidden relative">
      {/* Background Ambience Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        {/* Header with Title and Share Experience Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 sm:mb-16 max-w-4xl mx-auto">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Voices of Impact
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What Our Community Says
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Real stories and ratings from youth fellows, students, partners, and volunteers.
            </p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-6 h-12 shadow-lg shadow-blue-500/20 hover:scale-105 transition-all cursor-pointer shrink-0">
                <MessageSquareHeart className="w-4 h-4 mr-2" />
                Share Your Experience
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[540px] bg-white border-slate-200 text-slate-900 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
                  <MessageSquareHeart className="w-6 h-6 text-blue-600" />
                  Share Your Experience
                </DialogTitle>
                <p className="text-sm text-slate-500 mt-1">
                  Tell the community about your journey with Youth Empowerment Hub and give your rating.
                </p>
              </DialogHeader>

              {submitted ? (
                <div className="py-12 flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Experience Submitted!</h3>
                  <p className="text-sm text-slate-600 max-w-xs">
                    Thank you! Your rating and testimonial will appear on the homepage once verified by our team.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 mt-3">
                  {/* Star Rating Selector */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                    <Label className="text-slate-900 font-bold text-sm flex items-center justify-between">
                      <span>Rate Your Experience *</span>
                      <span className="text-xs font-semibold text-amber-600">
                        {ratingLabels[hoverRating || formData.rating] || `${formData.rating} Stars`}
                      </span>
                    </Label>
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = star <= (hoverRating || formData.rating);
                        return (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setFormData({ ...formData, rating: star })}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1 text-2xl focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                            aria-label={`Select ${star} stars`}
                          >
                            <Star
                              className={`w-7 h-7 transition-colors ${
                                isFilled
                                  ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                                  : 'text-slate-300 hover:text-amber-300'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="personName" className="text-slate-900 font-semibold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-blue-600" />
                      Your Full Name *
                    </Label>
                    <Input
                      id="personName"
                      placeholder="e.g. Sarah Joseph"
                      value={formData.personName}
                      onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                      required
                      className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="designation" className="text-slate-900 font-semibold flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-blue-600" />
                        Role / Program
                      </Label>
                      <Input
                        id="designation"
                        placeholder="e.g. AI Fellow / Student"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="organization" className="text-slate-900 font-semibold flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-blue-600" />
                        College / Organization
                      </Label>
                      <Input
                        id="organization"
                        placeholder="e.g. IIIT Kottayam"
                        value={formData.organization}
                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                        className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="testimonialText" className="text-slate-900 font-semibold">
                      Your Story & Experience *
                    </Label>
                    <Textarea
                      id="testimonialText"
                      placeholder="Share what you learned, how the platform supported you, or your advice to other youth..."
                      rows={4}
                      value={formData.testimonialText}
                      onChange={(e) => setFormData({ ...formData, testimonialText: e.target.value })}
                      required
                      className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="photoUrl" className="text-slate-900 font-semibold">
                      Profile Photo URL (Optional)
                    </Label>
                    <Input
                      id="photoUrl"
                      placeholder="https://... or avatar link"
                      value={formData.photoUrl}
                      onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                      className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                    />
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-900 leading-relaxed">
                    ℹ️ <strong>Moderation Note:</strong> Submitted testimonials are reviewed by our team before being displayed on the site.
                  </div>

                  <DialogFooter className="pt-2 gap-2 sm:gap-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-xl border-slate-200 font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl cursor-pointer shadow-md"
                    >
                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                      {isSubmitting ? 'Submitting...' : 'Submit Experience'}
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Continuous Moving Testimonial Showcase */}
        {count > 0 ? (
          <div
            className="max-w-4xl mx-auto relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Sliding Card Container */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: direction > 0 ? 40 : -40, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction > 0 ? -40 : 40, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="w-full"
                >
                  <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-200/40 relative overflow-hidden flex flex-col items-center text-center">
                    {/* Top Header: Star Rating & Quote Icon */}
                    <div className="flex items-center justify-between w-full mb-6">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-5 h-5 ${
                              s <= currentRating
                                ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                        <span className="text-xs font-extrabold text-slate-500 ml-1">
                          {currentRating}.0
                        </span>
                      </div>
                      <Quote className="w-10 h-10 text-blue-500/20" />
                    </div>

                    {/* Testimonial Quote */}
                    <blockquote className="text-lg sm:text-2xl font-medium text-slate-800 leading-relaxed mb-8 break-words max-w-2xl">
                      "{current.quote}"
                    </blockquote>

                    {/* Author Info */}
                    <div className="flex flex-col items-center">
                      <Avatar className="w-16 h-16 mb-3 border-2 border-blue-200 shadow-md ring-4 ring-blue-50">
                        <AvatarImage src={current.avatarUrl} alt={current.name} />
                        <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-lg">
                          {current.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <h4 className="font-extrabold text-lg sm:text-xl text-slate-900">{current.name}</h4>
                      <p className="text-sm text-slate-500 font-medium mt-0.5">
                        {current.designation}
                        {current.organization && ` • ${current.organization}`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {count > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    aria-label="Previous testimonial"
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-6 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-700 hover:text-blue-600 hover:scale-110 transition-all cursor-pointer z-20"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNext}
                    aria-label="Next testimonial"
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-6 w-11 h-11 rounded-full bg-white border border-slate-200 shadow-lg flex items-center justify-center text-slate-700 hover:text-blue-600 hover:scale-110 transition-all cursor-pointer z-20"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Pagination Dots & Autoplay Indicator */}
            {count > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      index === currentIndex ? 'bg-blue-600 w-8' : 'bg-slate-300 hover:bg-slate-400 w-2.5'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-xl mx-auto text-center py-16 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center border border-blue-100">
              <MessageSquareHeart className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Be the First to Share Your Experience</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Have you participated in our programs, hackathons, or workshops? We'd love to feature your story and rating!
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-md cursor-pointer"
            >
              Share Your Story
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}