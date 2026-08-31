import type { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Sparkles, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { PageHero } from '@/components/public/page-hero';
import { OutboundGate } from '@/components/public/outbound-gate';
import { SectionWrapper } from '@/components/shared/section-wrapper';
import { formatEventLocation } from '@/lib/utils';
import { getAllPublishedEvents } from '@/lib/public/queries';

export const metadata: Metadata = {
  title: 'Events & Workshops | Youth Empowerment Hub',
  description: 'Explore upcoming youth events, technology workshops, leadership summits, and sports tournaments.',
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab = tab === 'past' ? 'past' : 'upcoming';
  const allEvents = await getAllPublishedEvents();
  const now = new Date();

  const upcomingEvents = allEvents
    .filter((event) => event.date && new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  const pastEvents = allEvents
    .filter((event) => event.date && new Date(event.date) < now)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());

  const displayEvents = activeTab === 'past' ? pastEvents : upcomingEvents;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/70">
      <PageHero
        title="Events & Workshops"
        subtitle="Connect, learn, and grow through interactive hackathons, skill bootcamps, and community forums."
      />

      <SectionWrapper className="py-12 md:py-16">
        {/* Tab Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-slate-200/70 p-1.5 rounded-2xl border border-slate-300/60 shadow-sm">
            <Link
              href="/events?tab=upcoming"
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab !== 'past'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Upcoming Events ({upcomingEvents.length})
            </Link>
            <Link
              href="/events?tab=past"
              className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'past'
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past Events ({pastEvents.length})
            </Link>
          </div>
        </div>

        {/* Event Cards Grid */}
        {displayEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {displayEvents.map((event) => {
              const location = formatEventLocation(event);
              const eventDate = event.date ? new Date(event.date) : null;
              const endDate = event.endDate ? new Date(event.endDate) : null;

              return (
                <div
                  key={event.id}
                  className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-200/90 flex flex-col sm:flex-row gap-6 hover:shadow-lg hover:border-blue-300 transition-all overflow-hidden"
                >
                  {/* Left Column: Date Badge */}
                  <div className="sm:w-32 shrink-0">
                    <div className="bg-gradient-to-b from-blue-50 to-indigo-50/50 rounded-2xl aspect-square sm:aspect-auto sm:h-36 flex flex-col items-center justify-center border border-blue-100/80 p-4 text-center shadow-inner">
                      <span className="text-blue-600 font-extrabold text-sm sm:text-base uppercase tracking-wider">
                        {eventDate ? format(eventDate, 'MMM') : 'TBA'}
                      </span>
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 my-1">
                        {eventDate ? format(eventDate, 'dd') : '—'}
                      </span>
                      <span className="text-slate-500 font-semibold text-xs sm:text-sm">
                        {eventDate ? format(eventDate, 'yyyy') : ''}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Full Details */}
                  <div className="flex flex-col flex-1 min-w-0">
                    {/* Category & Status Badges */}
                    <div className="flex items-center flex-wrap gap-2 mb-2.5">
                      {event.category ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold text-violet-700 bg-violet-50 border border-violet-200/80 uppercase tracking-wider">
                          {event.category}
                        </span>
                      ) : null}
                      {event.featured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          Featured
                        </span>
                      ) : null}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-3 break-words">
                      {event.title}
                    </h3>

                    {/* Full Description (NO line-clamp so all words are shown) */}
                    {event.description ? (
                      <div className="text-slate-700 text-sm sm:text-base leading-relaxed mb-6 break-words whitespace-pre-line">
                        {event.description}
                      </div>
                    ) : null}

                    {/* Time & Venue Info (Full wrapping, never overflows) */}
                    <div className="space-y-2 text-xs sm:text-sm text-slate-600 font-medium mt-auto pt-4 border-t border-slate-100">
                      {event.time ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                          <span className="break-words font-semibold text-slate-800">{event.time}</span>
                          {endDate ? (
                            <span className="text-slate-400 text-xs">
                              (until {format(endDate, 'PPP')})
                            </span>
                          ) : null}
                        </div>
                      ) : null}

                      {location ? (
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span className="break-words leading-snug flex-1">{location}</span>
                        </div>
                      ) : null}
                    </div>

                    {/* Registration / Action Button */}
                    {activeTab === 'upcoming' && event.registrationUrl ? (
                      <div className="mt-6 pt-2">
                        <OutboundGate
                          title={event.title}
                          description="You are about to open the official event registration portal."
                          href={event.registrationUrl}
                          urlType="external"
                          fallbackHref="/contact?category=Events"
                          ctaLabel="Register for Event"
                          className="w-full sm:w-auto px-6 h-11 font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-28 bg-white rounded-3xl border border-slate-200 border-dashed max-w-xl mx-auto p-8 shadow-sm">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {activeTab === 'past' ? 'No past events found.' : 'No upcoming events at the moment.'}
            </h3>
            <p className="text-slate-500 text-sm">Please check back soon or follow our announcements for new schedules.</p>
          </div>
        )}
      </SectionWrapper>
    </div>
  );
}