'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Star, 
  Image as ImageIcon,
  Video as VideoIcon,
  Link as LinkIcon,
  Calendar,
  MapPin,
  ExternalLink,
  Loader2,
  Play
} from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { SafeImage } from '@/components/shared/safe-image';
import { getMediaThumbnail, getUniversalEmbedUrl } from '@/components/public/media-lightbox-modal';
import { 
  createGalleryItem, 
  updateGalleryItem, 
  deleteGalleryItem, 
  toggleGalleryStatus 
} from '@/lib/actions/gallery';

const CATEGORIES = [
  'Events',
  'Hackathons',
  'Workshops',
  'Fellowships',
  'Youth Summits',
  'Community',
  'Orientation',
];

export default function GalleryManager({ initialData = [] }: { initialData: any[] }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [filterTab, setFilterTab] = useState<'all' | 'image' | 'video' | 'featured' | 'draft'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaType: 'image',
    mediaUrl: '',
    thumbnailUrl: '',
    category: 'Events',
    eventDate: '',
    location: '',
    externalLink: '',
    featured: true,
    displayOrder: 0,
    status: 'published',
  });

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const filteredData = data.filter((item) => {
    if (filterTab === 'image') return item.mediaType === 'image';
    if (filterTab === 'video') return item.mediaType === 'video';
    if (filterTab === 'featured') return Boolean(item.featured);
    if (filterTab === 'draft') return item.status === 'draft';
    return true;
  });

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setCurrentId(item.id);
      setFormData({
        title: item.title || '',
        description: item.description || '',
        mediaType: item.mediaType || 'image',
        mediaUrl: item.mediaUrl || '',
        thumbnailUrl: item.thumbnailUrl || '',
        category: item.category || 'Events',
        eventDate: item.eventDate ? new Date(item.eventDate).toISOString().split('T')[0] : '',
        location: item.location || '',
        externalLink: item.externalLink || '',
        featured: item.featured ?? false,
        displayOrder: item.displayOrder ?? 0,
        status: item.status || 'published',
      });
    } else {
      setCurrentId(null);
      setFormData({
        title: '',
        description: '',
        mediaType: 'image',
        mediaUrl: '',
        thumbnailUrl: '',
        category: 'Events',
        eventDate: new Date().toISOString().split('T')[0],
        location: '',
        externalLink: '',
        featured: true,
        displayOrder: data.length + 1,
        status: 'published',
      });
    }
    setIsDialogOpen(true);
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    setTogglingId(id);
    const willPublish = currentStatus !== 'published';
    try {
      const res = await toggleGalleryStatus(id, willPublish);
      if (res.success && res.data) {
        toast.success(willPublish ? 'Item published to gallery!' : 'Item moved to drafts');
        setData((prev) => prev.map((d) => (d.id === id ? res.data : d)));
        router.refresh();
      } else {
        toast.error('Failed to update status');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setTogglingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) {
          fd.append(k, typeof v === 'boolean' ? (v ? 'true' : 'false') : String(v));
        }
      });

      const res = currentId ? await updateGalleryItem(currentId, fd) : await createGalleryItem(fd);

      if (res.success && res.data) {
        toast.success(currentId ? 'Gallery item updated successfully' : 'Gallery item added successfully');
        if (currentId) {
          setData((prev) => prev.map((d) => (d.id === currentId ? res.data : d)));
        } else {
          setData((prev) => [res.data, ...prev]);
        }
        setIsDialogOpen(false);
        router.refresh();
      } else {
        const errMsg =
          typeof res.error === 'object' && res.error !== null
            ? Object.entries(res.error)
                .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
                .join('; ')
            : String(res.error || 'Failed to save gallery item');
        toast.error(errMsg);
      }
    } catch {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentId) return;
    try {
      const res = await deleteGalleryItem(currentId);
      if (res.success) {
        toast.success('Gallery item deleted successfully');
        setData((prev) => prev.filter((d) => d.id !== currentId));
        setIsConfirmOpen(false);
        router.refresh();
      } else {
        toast.error('Failed to delete item');
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  const columns = [
    {
      accessorKey: 'mediaUrl',
      header: 'Preview',
      cell: ({ row }: any) => {
        const item = row.original;
        const isVideo = item.mediaType === 'video';
        const displayImg = getMediaThumbnail(item);

        return (
          <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shrink-0">
            {displayImg ? (
              <SafeImage src={displayImg} alt={item.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-400">
                {isVideo ? <VideoIcon className="w-5 h-5 text-cyan-400" /> : <ImageIcon className="w-5 h-5" />}
              </div>
            )}
            {isVideo && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'title',
      header: 'Title & Category',
      cell: ({ row }: any) => {
        const item = row.original;
        return (
          <div className="space-y-1 py-1 max-w-xs sm:max-w-md">
            <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
              {item.featured && (
                <span title="Featured on Homepage">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                </span>
              )}
              <span className="truncate">{item.title}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
              <span className="px-2 py-0.5 rounded-md font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                {item.category || 'Events'}
              </span>
              <span className="flex items-center gap-1 uppercase font-bold text-[10px] text-slate-400">
                {item.mediaType === 'video' ? <VideoIcon className="w-3 h-3 text-cyan-600" /> : <ImageIcon className="w-3 h-3 text-blue-600" />}
                {item.mediaType}
              </span>
              {item.location && (
                <span className="flex items-center gap-0.5 text-slate-400">
                  <MapPin className="w-3 h-3" /> {item.location}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        return (
          <Badge
            variant={status === 'published' ? 'default' : 'secondary'}
            className={`font-bold ${
              status === 'published'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : status === 'draft'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {status === 'published' ? '🟢 Published' : status === 'draft' ? '📝 Draft' : '📦 Archived'}
          </Badge>
        );
      },
    },
    {
      id: 'publishAction',
      header: 'Toggle Live',
      cell: ({ row }: any) => {
        const item = row.original;
        const isPublished = item.status === 'published';
        const isLoading = togglingId === item.id;

        return (
          <Button
            size="sm"
            variant={isPublished ? 'outline' : 'default'}
            disabled={isLoading}
            onClick={() => handleToggleStatus(item.id, item.status)}
            className={`h-8 text-xs font-bold rounded-xl cursor-pointer ${
              isPublished
                ? 'border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-700'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isPublished ? (
              'Unpublish'
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Publish
              </>
            )}
          </Button>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-1.5 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenDialog(row.original)}
            className="h-8 w-8 p-0 cursor-pointer hover:bg-slate-100 rounded-lg text-slate-700"
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentId(row.original.id);
              setIsConfirmOpen(true);
            }}
            className="h-8 w-8 p-0 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <ImageIcon className="w-7 h-7 text-blue-600" />
            Gallery & Event Glimpses
          </h2>
          <p className="text-slate-500 mt-1">
            Upload and manage photos, video clips (YouTube shorts, reels, streams), and highlights of workshops, hackathons, and youth programs.
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 h-11 rounded-xl cursor-pointer shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Media / Glimpse
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 w-fit">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            filterTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({data.length})
        </button>
        <button
          onClick={() => setFilterTab('image')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterTab === 'image' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" /> Photos ({data.filter((d) => d.mediaType === 'image').length})
        </button>
        <button
          onClick={() => setFilterTab('video')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterTab === 'video' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <VideoIcon className="w-3.5 h-3.5" /> Video Clips ({data.filter((d) => d.mediaType === 'video').length})
        </button>
        <button
          onClick={() => setFilterTab('featured')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterTab === 'featured' ? 'bg-amber-500 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Star className="w-3.5 h-3.5" /> Homepage Featured ({data.filter((d) => d.featured).length})
        </button>
        <button
          onClick={() => setFilterTab('draft')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            filterTab === 'draft' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Drafts ({data.filter((d) => d.status === 'draft').length})
        </button>
      </div>

      {/* Table / Empty State */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <EmptyState
            title="No gallery items found"
            description="Add event photos, video clips, or press links to showcase your organization's real impact."
            actionLabel="Add Media"
            onAction={() => handleOpenDialog()}
          />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-2 overflow-hidden">
          <DataTable columns={columns} data={filteredData} searchKey="title" />
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[560px] bg-white border-slate-200 text-slate-900 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              {currentId ? 'Edit Gallery Item' : 'Add Event Glimpse / Media'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-slate-900 font-semibold">
                Event / Glimpse Title *
              </Label>
              <Input
                id="title"
                placeholder="e.g. National Youth Summit 2026 Opening Ceremony"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="mediaType" className="text-slate-900 font-semibold">
                  Media Type *
                </Label>
                <Select
                  value={formData.mediaType}
                  onValueChange={(v) => setFormData({ ...formData, mediaType: v })}
                >
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900 rounded-xl">
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-900">
                    <SelectItem value="image">📸 Photo / Image</SelectItem>
                    <SelectItem value="video">🎥 Video Clip (YouTube Shorts/Video/MP4)</SelectItem>
                    <SelectItem value="link">🔗 External Album / Article Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-slate-900 font-semibold">
                  Category *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(v) => setFormData({ ...formData, category: v })}
                >
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900 rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-900">
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mediaUrl" className="text-slate-900 font-semibold">
                {formData.mediaType === 'video'
                  ? 'Video URL (YouTube watch link, Shorts, Vimeo, or MP4) *'
                  : formData.mediaType === 'link'
                  ? 'Target Web Link *'
                  : 'Photo / Image URL *'}
              </Label>
              <Input
                id="mediaUrl"
                placeholder={
                  formData.mediaType === 'video'
                    ? 'https://youtube.com/shorts/... or https://youtube.com/watch?v=...'
                    : 'https://images.unsplash.com/... or image link'
                }
                value={formData.mediaUrl}
                onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                required
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>

            {formData.mediaType === 'video' && (
              <div className="space-y-1.5">
                <Label htmlFor="thumbnailUrl" className="text-slate-900 font-semibold">
                  Custom Video Thumbnail URL (Optional - YouTube covers are auto-extracted)
                </Label>
                <Input
                  id="thumbnailUrl"
                  placeholder="https://... custom cover image URL (optional)"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="eventDate" className="text-slate-900 font-semibold">
                  Event Date
                </Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="location" className="text-slate-900 font-semibold">
                  Location / Venue
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Main Auditorium / IIIT Kottayam"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-slate-900 font-semibold">
                Story / Caption (Optional)
              </Label>
              <Textarea
                id="description"
                placeholder="Brief summary of the event highlights, key moments, or participants..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="externalLink" className="text-slate-900 font-semibold">
                External Link (Full Album / Press Recap URL)
              </Label>
              <Input
                id="externalLink"
                placeholder="https://... link to full photo album or news recap"
                value={formData.externalLink}
                onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-slate-900 font-semibold">
                  Publish Status *
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => setFormData({ ...formData, status: v })}
                >
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900 rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-900">
                    <SelectItem value="published">🟢 Published (Live in Gallery)</SelectItem>
                    <SelectItem value="draft">📝 Draft (Hidden)</SelectItem>
                    <SelectItem value="archived">📦 Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 my-auto">
                <div className="space-y-0.5">
                  <Label htmlFor="featured" className="text-slate-900 font-bold cursor-pointer">
                    Homepage Glimpse
                  </Label>
                  <p className="text-[11px] text-slate-500">Feature on homepage</p>
                </div>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(c) => setFormData({ ...formData, featured: c })}
                />
              </div>
            </div>

            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl border-slate-200 font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 rounded-xl cursor-pointer shadow-md"
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? 'Saving...' : currentId ? 'Save Changes' : 'Add to Gallery'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Gallery Item"
        description="Are you sure you want to delete this gallery item? This action cannot be undone."
        destructive
      />
    </div>
  );
}