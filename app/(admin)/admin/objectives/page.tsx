import { db } from '@/lib/db';
import { objectives } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import ObjectiveManager from '@/components/admin/objectives/objective-manager';

export const dynamic = 'force-dynamic';

export default async function ObjectivesPage() {
  try {
    const data = await db.query.objectives.findMany({
      orderBy: [desc(objectives.displayOrder)]
    });
    
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <ObjectiveManager initialData={data} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch objectives:', error);
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load objectives. Please try again later.
      </div>
    );
  }
}
