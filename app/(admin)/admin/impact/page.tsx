import { db } from '@/lib/db';
import { impactMetrics } from '@/lib/db/schema';
import { asc } from 'drizzle-orm';
import ImpactManager from '@/components/admin/impact/impact-manager';

export const dynamic = 'force-dynamic';

export default async function ImpactPage() {
  try {
    const data = await db
      .select()
      .from(impactMetrics)
      .orderBy(asc(impactMetrics.displayOrder));
    
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <ImpactManager initialData={data} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch impact metrics:', error);
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load impact metrics. Please try again later.
      </div>
    );
  }
}