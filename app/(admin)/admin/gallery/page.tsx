import { db } from '@/lib/db';
import { galleryItems } from '@/lib/db/schema';
import { desc, asc } from 'drizzle-orm';
import GalleryManager from '@/components/admin/gallery/gallery-manager';

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage() {
  try {
    const data = await db
      .select()
      .from(galleryItems)
      .orderBy(asc(galleryItems.displayOrder), desc(galleryItems.createdAt));

    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <GalleryManager initialData={data} />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch gallery items:', error);
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load gallery items. Please try again later.
      </div>
    );
  }
}