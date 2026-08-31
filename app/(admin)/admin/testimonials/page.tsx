import { db } from '@/lib/db';
import { testimonials } from '@/lib/db/schema';
import { desc } from 'drizzle-orm';
import TestimonialManager from '@/components/admin/testimonials/testimonial-manager';

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  try {
    const data = await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));
    
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <TestimonialManager initialData={data} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch testimonials:', error);
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load testimonials. Please try again later.
      </div>
    );
  }
}