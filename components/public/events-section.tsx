'use client';

import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, Clock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { formatEventLocation } from '@/lib/utils';
import { OutboundGate } from '@/components/public/outbound-gate';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { format } from 'date-fns';

type EventCard = {
  id: string;
  title: string;
  description?: string | null;
  date?: Date | string | null;
  endDate?: Date | string | null;
  time?: string | null;
  venue?: string | null;
  district?: string | null;
  state?: string | null;
  category?: string | null;
  registrationUrl?: string | null;
};

export function EventsSection({ events = [] }: { events?: EventCard[] }) {
  const displayEvents = events.slice(0, 3);

  return (
    <SectionWrapper className="bg-white border-t border-slate-200/60">
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Stay Connected
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Upcoming Events</h2>
        <p className="mt-3 text-slate-600 max-w-2xl text-base sm:text-lg leading-relaxed">
          Participate in workshops, technical hackathons, athletic tournaments, and leadership seminars.
        </p>
      </div>

      {displayEvents.length > 0 ? (
        <div className="mt-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayEvents.map((event, index) => {
              const eventDate = event.date ? new Date(event.date) : null;
              const location = formatEventLocation(event) || 'Location to be announced';

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 hover:border-blue-300 hover:shadow-xl transition-all h-full"
                >
                  {/* Top Section: Date Badge & Category */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 shrink-0 border border-blue-100 shadow-sm">
                      <span className="text-2xl font-extrabold leading-none">
                        {eventDate ? format(eventDate, 'dd') : '—'}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider mt-1 text-blue-700">
                        {eventDate ? format(eventDate, 'MMM') : 'TBA'}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                      {event.category ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/60 mb-2 truncate max-w-full">
                          {event.category}
                        </span>
                      ) : null}
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug break-words group-hover:text-blue-600 transition-colors">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description (if present) */}
                  {event.description ? (
                    <p className="text-slate-600 text-sm leading-relaxed mb-4 break-words">
                      {event.description}
                    </p>
                  ) : null}

                  {/* Details Strip (Time & Location) */}
                  <div className="space-y-2.5 my-auto pt-2 text-sm text-slate-600">
                    {event.time ? (
                      <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                        <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="break-words">{event.time}</span>
                      </div>
                    ) : null}

                    <div className="flex items-start gap-2 text-xs sm:text-sm font-medium text-slate-600">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="break-words leading-relaxed flex-1">{location}</span>
                    </div>
                  </div>

                  {/* Action Link / Button */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    {event.registrationUrl ? (
                      <OutboundGate
                        title={event.title}
                        description="You are about to open the event registration page."
                        href={event.registrationUrl}
                        urlType="external"
                        fallbackHref="/events"
                        ctaLabel="Register Now"
                        className="w-full justify-center rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white"
                      />
                    ) : (
                      <Link
                        href="/events"
                        className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 group/link"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold text-white bg-slate-900 rounded-2xl hover:bg-slate-800 shadow-md transition-all hover:scale-[1.02]"
            >
              <span>View All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center py-16 text-center rounded-3xl bg-white border border-slate-200 shadow-sm max-w-2xl mx-auto p-8">
          <Calendar className="w-12 h-12 text-blue-500/50 mb-4" />
          <p className="text-slate-800 font-bold text-lg">No upcoming events scheduled right now.</p>
          <p className="text-slate-500 text-sm mt-1">New workshops, seminars, and competitions will appear here soon.</p>
        </div>
      )}
    </SectionWrapper>
  );
}