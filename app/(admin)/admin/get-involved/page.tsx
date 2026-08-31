import { db } from '@/lib/db';
import { getInvolvedLinks } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import GetInvolvedManager from '@/components/admin/get-involved/get-involved-manager';

export const dynamic = 'force-dynamic';

export default async function GetInvolvedPage() {
  try {
    const data = await db.query.getInvolvedLinks.findMany({
      orderBy: [desc(getInvolvedLinks.displayOrder)]
    });
    
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <GetInvolvedManager initialData={data} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch get involved links:', error);
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load get involved options. Please try again later.
      </div>
    );
  }
}
