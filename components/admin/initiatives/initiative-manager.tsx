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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2, Sparkles, Loader2, Lightbulb } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { createInitiative, updateInitiative, deleteInitiative } from '@/lib/actions/initiatives';

export default function InitiativeManager({ initialData = [] }: { initialData: any[] }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'lightbulb',
    imageUrl: '',
    category: 'Education',
    ctaText: 'Learn More',
    ctaUrl: '',
    displayOrder: 0,
    status: 'published'
  });

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const categories = [
    'Education', 
    'Technology', 
    'Sports & Athletics', 
    'Career & Employment', 
    'Entrepreneurship', 
    'Community Development', 
    'Digital Literacy', 
    'Social Welfare', 
    'Youth Engagement'
  ];

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setCurrentId(item.id);
      setFormData({
        title: item.title || '',
        description: item.description || '',
        icon: item.icon || 'lightbulb',
        imageUrl: item.imageUrl || '',
        category: item.category || 'Education',
        ctaText: item.ctaText || 'Learn More',
        ctaUrl: item.ctaUrl || '',
        displayOrder: item.displayOrder || 0,
        status: item.status || 'published'
      });
    } else {
      setCurrentId(null);
      setFormData({
        title: '',
        description: '',
        icon: 'lightbulb',
        imageUrl: '',
        category: 'Education',
        ctaText: 'Learn More',
        ctaUrl: '',
        displayOrder: 0,
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
          fd.append(k, String(v));
        }
      });

      const res = currentId ? await updateInitiative(currentId, fd) : await createInitiative(fd);
      
      if (res.success && res.data) {
        toast.success(currentId ? 'Initiative updated successfully' : 'Initiative created successfully');
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
          : String(res.error || 'Failed to save initiative');
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
      const res = await deleteInitiative(currentId);
      if (res.success) {
        toast.success('Initiative deleted successfully');
        setData(prev => prev.filter(d => d.id !== currentId));
        setIsConfirmOpen(false);
        router.refresh();
      } else {
        toast.error('Failed to delete initiative');
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  const columns = [
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }: any) => (
        <div className="font-bold text-slate-900">
          {row.original.title}
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
      accessorKey: 'displayOrder',
      header: 'Order',
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
            <Lightbulb className="w-7 h-7 text-blue-600" />
            Initiatives Management
          </h2>
          <p className="text-slate-500 mt-1">Manage impact programs, workshops, and campaigns displayed on the public site.</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 h-11 rounded-xl cursor-pointer shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Initiative
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <EmptyState 
            title="No initiatives yet" 
            description="Create your first organization initiative to feature it on the homepage and initiatives directory." 
            actionLabel="Create Initiative" 
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
              {currentId ? 'Edit Initiative' : 'Add New Initiative'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-slate-900 font-semibold">Initiative Title *</Label>
              <Input 
                id="title" 
                placeholder="e.g. Youth Leadership & AI Literacy"
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                required 
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-slate-900 font-semibold">Description *</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the objectives and impact of this initiative..."
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                rows={3}
                required 
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="category" className="text-slate-900 font-semibold">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900 rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-900">
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="icon" className="text-slate-900 font-semibold">Icon Style</Label>
                <Select value={formData.icon} onValueChange={(v) => setFormData({...formData, icon: v})}>
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900 rounded-xl">
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-900">
                    <SelectItem value="lightbulb">💡 Innovation (Lightbulb)</SelectItem>
                    <SelectItem value="rocket">🚀 Growth (Rocket)</SelectItem>
                    <SelectItem value="target">🎯 Goal (Target)</SelectItem>
                    <SelectItem value="users">👥 Community (Users)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="displayOrder" className="text-slate-900 font-semibold">Display Priority</Label>
                <Input 
                  id="displayOrder" 
                  type="number" 
                  value={formData.displayOrder} 
                  onChange={(e) => setFormData({...formData, displayOrder: Number(e.target.value)})} 
                  className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ctaText" className="text-slate-900 font-semibold">Button Label</Label>
                <Input 
                  id="ctaText" 
                  placeholder="e.g. Learn More"
                  value={formData.ctaText} 
                  onChange={(e) => setFormData({...formData, ctaText: e.target.value})} 
                  className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ctaUrl" className="text-slate-900 font-semibold">Destination URL</Label>
                <Input 
                  id="ctaUrl" 
                  placeholder="https://... or /contact"
                  value={formData.ctaUrl} 
                  onChange={(e) => setFormData({...formData, ctaUrl: e.target.value})} 
                  className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="imageUrl" className="text-slate-900 font-semibold">Cover Image URL (Optional)</Label>
              <Input 
                id="imageUrl" 
                placeholder="https://... or /images/..."
                value={formData.imageUrl} 
                onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
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
                {isSubmitting ? 'Saving...' : currentId ? 'Save Changes' : 'Create Initiative'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog 
        open={isConfirmOpen} 
        onOpenChange={() => setIsConfirmOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Initiative" 
        description="Are you sure you want to delete this initiative? This action cannot be undone." 
        destructive
      />
    </div>
  );
}