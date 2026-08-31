import { db } from '@/lib/db';
import { contactSubmissions } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import ContactManager from '@/components/admin/contact/contact-manager';

export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  try {
    const data = await db.query.contactSubmissions.findMany({
      orderBy: [desc(contactSubmissions.createdAt)]
    });
    
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <ContactManager initialData={data} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch contact submissions:', error);
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load contact submissions. Please try again later.
      </div>
    );
  }
}
