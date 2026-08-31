import { DashboardCard } from '@/components/admin/dashboard-cards';
import { 
  Layers, 
  Calendar, 
  Megaphone, 
  Mail, 
  MessageSquare, 
  Globe,
  PlusCircle,
  Eye
} from 'lucide-react';
import { db } from '@/lib/db';
import { platforms, events, announcements, contactSubmissions, testimonials, getInvolvedLinks } from '@/lib/db/schema';
import { count, eq } from 'drizzle-orm';
import Link from 'next/link';
import { EmptyState } from '@/components/admin/empty-state';

export default async function AdminDashboardPage({ params, searchParams }: PageProps<'/admin'>) {
  // Must await params/searchParams in Next.js 15+ per instructions (even if not used)
  await Promise.resolve(params);
  await Promise.resolve(searchParams);

  let stats = {
    totalPlatforms: 0,
    livePlatforms: 0,
    comingSoonPlatforms: 0,
    upcomingEvents: 0,
    publishedAnnouncements: 0,
    unreadMessages: 0,
    publishedTestimonials: 0,
    activeLinks: 0
  };

  let auditLogs: any[] = [];
  let isDbConnected = false;

  try {
    const [
      platformsTotal,
      platformsLive,
      platformsSoon,
      eventsUpcoming,
      announcementsPub,
      messagesUnread,
      testimonialsPub,
      linksActive
    ] = await Promise.all([
      db.select({ value: count() }).from(platforms),
      db.select({ value: count() }).from(platforms).where(eq(platforms.status, 'live')),
      db.select({ value: count() }).from(platforms).where(eq(platforms.status, 'coming_soon')),
      db.select({ value: count() }).from(events).where(eq(events.status, 'published')),
      db.select({ value: count() }).from(announcements).where(eq(announcements.status, 'published')),
      db.select({ value: count() }).from(contactSubmissions).where(eq(contactSubmissions.status, 'new')),
      db.select({ value: count() }).from(testimonials).where(eq(testimonials.status, 'published')),
      db.select({ value: count() }).from(getInvolvedLinks).where(eq(getInvolvedLinks.status, 'published'))
    ]);

    stats = {
      totalPlatforms: platformsTotal[0].value,
      livePlatforms: platformsLive[0].value,
      comingSoonPlatforms: platformsSoon[0].value,
      upcomingEvents: eventsUpcoming[0].value,
      publishedAnnouncements: announcementsPub[0].value,
      unreadMessages: messagesUnread[0].value,
      publishedTestimonials: testimonialsPub[0].value,
      activeLinks: linksActive[0].value
    };
    isDbConnected = true;
  } catch (error) {
    console.error("Failed to fetch dashboard stats", error);
  }

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard 
            label="Total Platforms" 
            value={isDbConnected ? stats.totalPlatforms : 'N/A'} 
            icon={Layers} 
            color="#3B82F6" 
            href="/admin/platforms" 
          />
          <DashboardCard 
            label="Upcoming Events" 
            value={isDbConnected ? stats.upcomingEvents : 'N/A'} 
            icon={Calendar} 
            color="#8B5CF6" 
            href="/admin/events" 
          />
          <DashboardCard 
            label="Unread Messages" 
            value={isDbConnected ? stats.unreadMessages : 'N/A'} 
            icon={Mail} 
            color="#F59E0B" 
            href="/admin/contact" 
          />
          <DashboardCard 
            label="Active Opportunities" 
            value={isDbConnected ? stats.activeLinks : 'N/A'} 
            icon={Globe} 
            color="#10B981" 
            href="/admin/get-involved" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            {!isDbConnected || auditLogs.length === 0 ? (
              <EmptyState 
                icon={Eye} 
                title="No recent activity" 
                description="Activity logs will appear here once actions are taken in the system."
              />
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                {/* Map through audit logs here */}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-fit">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
          </div>
          <div className="p-4 flex flex-col gap-2">
            <Link 
              href="/admin/platforms/new" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#3B82F6] transition-colors group"
            >
              <div className="p-2 bg-slate-100 rounded-md group-hover:bg-blue-100 transition-colors">
                <PlusCircle size={18} className="text-slate-500 group-hover:text-[#3B82F6]" />
              </div>
              <span className="font-medium">Add New Platform</span>
            </Link>
            <Link 
              href="/admin/events/new" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#3B82F6] transition-colors group"
            >
              <div className="p-2 bg-slate-100 rounded-md group-hover:bg-blue-100 transition-colors">
                <Calendar size={18} className="text-slate-500 group-hover:text-[#3B82F6]" />
              </div>
              <span className="font-medium">Create Event</span>
            </Link>
            <Link 
              href="/admin/contact" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#3B82F6] transition-colors group"
            >
              <div className="p-2 bg-slate-100 rounded-md group-hover:bg-blue-100 transition-colors">
                <Mail size={18} className="text-slate-500 group-hover:text-[#3B82F6]" />
              </div>
              <span className="font-medium">View Messages</span>
            </Link>
            <Link 
              href="/admin/announcements/new" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-[#3B82F6] transition-colors group"
            >
              <div className="p-2 bg-slate-100 rounded-md group-hover:bg-blue-100 transition-colors">
                <Megaphone size={18} className="text-slate-500 group-hover:text-[#3B82F6]" />
              </div>
              <span className="font-medium">Post Announcement</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
