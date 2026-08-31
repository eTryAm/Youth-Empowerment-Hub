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
import { Plus, Pencil, Trash2, Archive, Megaphone, Loader2, Star, Sparkles } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { createAnnouncement, updateAnnouncement, archiveAnnouncement, deleteAnnouncement } from '@/lib/actions/announcements';

export default function AnnouncementManager({ initialData = [] }: { initialData: any[] }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    imageUrl: '',
    externalUrl: '',
    category: 'General',
    featured: true,
    status: 'published'
  });

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setCurrentId(item.id);
      setFormData({
        title: item.title || '',
        description: item.description || '',
        date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
        imageUrl: item.imageUrl || '',
        externalUrl: item.externalUrl || '',
        category: item.category || 'General',
        featured: item.featured ?? false,
        status: item.status || 'published'
      });
    } else {
      setCurrentId(null);
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        imageUrl: '',
        externalUrl: '',
        category: 'General',
        featured: true,
        status: 'published'
      });
    }
    setIsDialogOpen(true);
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

      const res = currentId ? await updateAnnouncement(currentId, fd) : await createAnnouncement(fd);
      
      if (res.success && res.data) {
        toast.success(currentId ? 'Announcement updated successfully' : 'Announcement published successfully');
        if (currentId) {
          setData(prev => prev.map(d => d.id === currentId ? res.data : d));
        } else {
          setData(prev => [res.data, ...prev]);
        }
        setIsDialogOpen(false);
        router.refresh();
      } else {
        const errMsg = typeof res.error === 'object' && res.error !== null
          ? Object.entries(res.error).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; ')
          : String(res.error || 'Failed to save announcement');
        toast.error(errMsg || 'Operation failed');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentId) return;
    try {
      const res = await deleteAnnouncement(currentId);
      if (res.success) {
        toast.success('Announcement deleted successfully');
        setData(prev => prev.filter(d => d.id !== currentId));
        setIsConfirmOpen(false);
        router.refresh();
      } else {
        toast.error('Failed to delete announcement');
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const res = await archiveAnnouncement(id);
      if (res.success && res.data) {
        toast.success('Announcement archived');
        setData(prev => prev.map(d => d.id === id ? res.data : d));
        router.refresh();
      } else {
        toast.error('Archive failed');
      }
    } catch {
      toast.error('Archive failed');
    }
  };

  const columns = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }: any) => (
        <div className="font-bold text-slate-900 flex items-center gap-2">
          {row.original.featured ? (
            <span className="p-1 rounded bg-amber-50 text-amber-600" title="Featured Banner">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            </span>
          ) : null}
          <span>{row.original.title}</span>
        </div>
      )
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }: any) => (
        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
          {row.original.category || 'General'}
        </span>
      )
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
                : status === 'archived'
                ? 'bg-amber-100 text-amber-800 border-amber-200'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {status === 'published' ? '🟢 Published' : status === 'draft' ? '📝 Draft' : '📦 Archived'}
          </Badge>
        );
      }
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
            onClick={() => handleArchive(row.original.id)}
            className="h-8 w-8 p-0 cursor-pointer hover:bg-amber-50 text-amber-600 rounded-lg"
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => { setCurrentId(row.original.id); setIsConfirmOpen(true); }}
            className="h-8 w-8 p-0 cursor-pointer hover:bg-red-50 text-red-600 rounded-lg"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-blue-600" />
            Announcements & Notifications
          </h2>
          <p className="text-slate-500 mt-1">Broadcast high-priority notices, alert banners, and updates across the platform.</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 h-11 rounded-xl cursor-pointer shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Announcement
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <EmptyState 
            title="No announcements yet" 
            description="Create an announcement banner or notification alert for the website." 
            actionLabel="Create Announcement" 
            onAction={() => handleOpenDialog()} 
          />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-2 overflow-hidden">
          <DataTable columns={columns} data={data} searchKey="title" />
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[540px] bg-white border-slate-200 text-slate-900 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              {currentId ? 'Edit Announcement' : 'Publish Announcement'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-slate-900 font-semibold">Title *</Label>
              <Input 
                id="title" 
                placeholder="e.g. Registration Open for National Youth Summit"
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                required 
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-slate-900 font-semibold">Message / Summary</Label>
              <Textarea 
                id="description" 
                placeholder="Brief summary or notice displayed in banner and notification dropdown..."
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                rows={3}
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-slate-900 font-semibold">Category</Label>
                <Input 
                  id="category" 
                  placeholder="e.g. Alert, Opportunity, Event"
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})} 
                  className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-slate-900 font-semibold">Publish Status *</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900 rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-900">
                    <SelectItem value="published">🟢 Published (Live on site)</SelectItem>
                    <SelectItem value="draft">📝 Draft (Hidden)</SelectItem>
                    <SelectItem value="archived">📦 Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="externalUrl" className="text-slate-900 font-semibold">Action URL / Link (Optional)</Label>
              <Input 
                id="externalUrl" 
                placeholder="https://... or /events"
                value={formData.externalUrl} 
                onChange={(e) => setFormData({...formData, externalUrl: e.target.value})} 
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="space-y-0.5">
                <Label htmlFor="featured" className="text-slate-900 font-bold cursor-pointer">Featured Top Banner</Label>
                <p className="text-xs text-slate-500">Show as a prominent banner at the very top of all pages.</p>
              </div>
              <Switch 
                id="featured" 
                checked={formData.featured} 
                onCheckedChange={(c) => setFormData({...formData, featured: c})} 
              />
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
                {isSubmitting ? 'Saving...' : currentId ? 'Save Changes' : 'Publish Announcement'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog 
        open={isConfirmOpen} 
        onOpenChange={() => setIsConfirmOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Announcement" 
        description="Are you sure you want to delete this announcement? This action cannot be undone." 
        destructive
      />
    </div>
  );
}