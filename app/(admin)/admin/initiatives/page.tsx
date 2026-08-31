import { db } from '@/lib/db';
import { initiatives } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import InitiativeManager from '@/components/admin/initiatives/initiative-manager';

export const dynamic = 'force-dynamic';

export default async function InitiativesPage() {
  try {
    const data = await db
      .select()
      .from(initiatives)
      .orderBy(desc(initiatives.createdAt));
    
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <InitiativeManager initialData={data} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch initiatives:', error);
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load initiatives. Please try again later.
      </div>
    );
  }
}