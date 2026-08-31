import { Metadata } from 'next';
import { MediaLibrary } from '@/components/admin/media/media-library';
import { getMediaList } from '@/lib/actions/media';

export const metadata: Metadata = {
  title: 'Media Library | Admin | Youth Empowerment Hub',
};

export default async function MediaPage() {
  const mediaList = await getMediaList();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Media Library</h1>
        <p className="text-slate-500 mt-1">Manage uploaded images, documents, and media assets.</p>
      </div>
      <MediaLibrary initialMedia={mediaList as any} />
    </div>
  );
}