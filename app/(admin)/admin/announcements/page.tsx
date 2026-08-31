import { db } from '@/lib/db';
import { announcements } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import AnnouncementManager from '@/components/admin/announcements/announcement-manager';

export const dynamic = 'force-dynamic';

export default async function AnnouncementsPage() {
  try {
    const data = await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt));
    
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <AnnouncementManager initialData={data} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch announcements:', error);
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load announcements. Please try again later.
      </div>
    );
  }
}