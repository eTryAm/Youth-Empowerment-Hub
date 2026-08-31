import { db } from '@/lib/db';
import { partners } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import PartnerManager from '@/components/admin/partners/partner-manager';

export const dynamic = 'force-dynamic';

export default async function PartnersPage() {
  try {
    const data = await db.query.partners.findMany({
      orderBy: [desc(partners.displayOrder)]
    });
    
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PartnerManager initialData={data} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch partners:', error);
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load partners. Please try again later.
      </div>
    );
  }
}
