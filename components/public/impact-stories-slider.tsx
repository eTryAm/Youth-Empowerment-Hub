'use client';

import { useState, useEffect } from 'react';
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
  Award 
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

export type StoryItem = {
  id: string;
  quote: string;
  name: string;
  designation: string;
  organization?: string;
  avatarUrl?: string;
  rating?: number;
};

interface ImpactStoriesSliderProps {
  stories?: StoryItem[];
}

export function ImpactStoriesSlider({ stories = [] }: ImpactStoriesSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    personName: '',
    designation: '',
    organization: '',
    testimonialText: '',
    photoUrl: '',
    rating: 5,
  });

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const count = stories.length;
  const slideDurationMs = 5000;

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
        toast.success(res.message || 'Thank you for sharing your story!');
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
          : String(res.error || 'Failed to submit story');
        toast.error(errMsg);
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const current = stories[currentIndex] || stories[0];
  const currentRating = current?.rating ?? 5;

  const ratingLabels: Record<number, string> = {
    1: '1 Star - Needs Improvement',
    2: '2 Stars - Fair Experience',
    3: '3 Stars - Good & Helpful',
    4: '4 Stars - Very Good & Impactful',
    5: '5 Stars - Outstanding & Inspiring!'
  };

  return (
    <div className="space-y-6">
      {/* Share Story Button Row */}
      <div className="flex justify-end">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-5 h-11 shadow-md shadow-blue-500/20 hover:scale-105 transition-all cursor-pointer">
              <MessageSquareHeart className="w-4 h-4 mr-2" />
              Share Your Story
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[540px] bg-white border-slate-200 text-slate-900 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
                <MessageSquareHeart className="w-6 h-6 text-blue-600" />
                Share Your Impact Story
              </DialogTitle>
              <p className="text-sm text-slate-500 mt-1">
                Tell the community how our platforms and programs made a difference in your journey.
              </p>
            </DialogHeader>

            {submitted ? (
              <div className="py-12 flex flex-col items-center text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Story Submitted!</h3>
                <p className="text-sm text-slate-600 max-w-xs">
                  Your story has been received and will appear on the Impact page once reviewed by our team.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 mt-3">
                {/* Star Rating */}
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
                  <Label htmlFor="storyName" className="text-slate-900 font-semibold flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-blue-600" />
                    Your Full Name *
                  </Label>
                  <Input
                    id="storyName"
                    placeholder="e.g. Rahul Menon"
                    value={formData.personName}
                    onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                    required
                    className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="storyDesignation" className="text-slate-900 font-semibold flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-blue-600" />
                      Role / Program
                    </Label>
                    <Input
                      id="storyDesignation"
                      placeholder="e.g. Youth Ambassador"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="storyOrg" className="text-slate-900 font-semibold flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-blue-600" />
                      College / Organization
                    </Label>
                    <Input
                      id="storyOrg"
                      placeholder="e.g. Kerala Tech Hub"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="storyText" className="text-slate-900 font-semibold">
                    Your Story & Impact Experience *
                  </Label>
                  <Textarea
                    id="storyText"
                    placeholder="Share what you achieved, your experience with the hub, and how it impacted you..."
                    rows={4}
                    value={formData.testimonialText}
                    onChange={(e) => setFormData({ ...formData, testimonialText: e.target.value })}
                    required
                    className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="storyPhoto" className="text-slate-900 font-semibold">
                    Profile Photo URL (Optional)
                  </Label>
                  <Input
                    id="storyPhoto"
                    placeholder="https://... or profile image link"
                    value={formData.photoUrl}
                    onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                    className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                  />
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-900 leading-relaxed">
                  ℹ️ <strong>Moderation Note:</strong> Stories are verified by our team before going live on the Impact page.
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
                    {isSubmitting ? 'Submitting...' : 'Submit Story'}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Stories Slider Card */}
      {count > 0 ? (
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-lg shadow-slate-200/50 p-8 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="space-y-6"
              >
                {/* Rating & Quote Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= currentRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs font-extrabold text-slate-500 ml-1">
                      {currentRating}.0
                    </span>
                  </div>
                  <Quote className="w-8 h-8 text-blue-500/20" />
                </div>

                {/* Quote Text */}
                <blockquote className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed italic break-words">
                  "{current.quote}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-3.5 pt-2 border-t border-slate-100">
                  <Avatar className="w-12 h-12 border-2 border-blue-200 shadow-sm ring-2 ring-blue-50">
                    <AvatarImage src={current.avatarUrl} alt={current.name} />
                    <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-extrabold text-sm">
                      {current.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">{current.name}</h4>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      {current.designation}
                      {current.organization && ` • ${current.organization}`}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {count > 1 && (
              <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
                <div className="flex items-center gap-1.5">
                  {stories.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setDirection(index > currentIndex ? 1 : -1);
                        setCurrentIndex(index);
                      }}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        index === currentIndex ? 'bg-blue-600 w-6' : 'bg-slate-300 hover:bg-slate-400 w-2'
                      }`}
                      aria-label={`Go to story ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrev}
                    aria-label="Previous story"
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Next story"
                    className="w-8 h-8 rounded-full border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-200 text-center py-12 space-y-3">
          <Sparkles className="w-8 h-8 text-blue-500 mx-auto opacity-40" />
          <p className="text-slate-500 font-medium text-sm">Stories from youth and partners will appear here.</p>
        </div>
      )}
    </div>
  );
}