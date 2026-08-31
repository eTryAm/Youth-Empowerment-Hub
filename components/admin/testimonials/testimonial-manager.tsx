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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  MessageSquareHeart, 
  Sparkles, 
  Star, 
  Clock, 
  Loader2 
} from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial, 
  approveTestimonial 
} from '@/lib/actions/testimonials';

export default function TestimonialManager({ initialData = [] }: { initialData: any[] }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'published' | 'archived'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    personName: '',
    designation: '',
    organization: '',
    photoUrl: '',
    testimonialText: '',
    rating: 5,
    featured: false,
    status: 'published'
  });

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const pendingCount = data.filter(d => d.status === 'draft').length;
  const publishedCount = data.filter(d => d.status === 'published').length;

  const filteredData = data.filter(item => {
    if (filterTab === 'pending') return item.status === 'draft';
    if (filterTab === 'published') return item.status === 'published';
    if (filterTab === 'archived') return item.status === 'archived';
    return true;
  });

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setCurrentId(item.id);
      setFormData({
        personName: item.personName || '',
        designation: item.designation || '',
        organization: item.organization || '',
        photoUrl: item.photoUrl || '',
        testimonialText: item.testimonialText || '',
        rating: item.rating ?? 5,
        featured: item.featured || false,
        status: item.status || 'published'
      });
    } else {
      setCurrentId(null);
      setFormData({
        personName: '',
        designation: '',
        organization: '',
        photoUrl: '',
        testimonialText: '',
        rating: 5,
        featured: false,
        status: 'published'
      });
    }
    setIsDialogOpen(true);
  };

  const handleToggleApprove = async (id: string, currentStatus: string) => {
    setApprovingId(id);
    const willPublish = currentStatus !== 'published';
    try {
      const res = await approveTestimonial(id, willPublish);
      if (res.success && res.data) {
        toast.success(willPublish ? 'Testimonial approved & published to homepage!' : 'Testimonial moved to drafts');
        setData(prev => prev.map(d => d.id === id ? res.data : d));
        router.refresh();
      } else {
        toast.error('Failed to update status');
      }
    } catch {
      toast.error('An unexpected error occurred');
    } finally {
      setApprovingId(null);
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

      const res = currentId ? await updateTestimonial(currentId, fd) : await createTestimonial(fd);
      
      if (res.success && res.data) {
        toast.success(currentId ? 'Testimonial updated successfully' : 'Testimonial created successfully');
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
          : String(res.error || 'Failed to save testimonial');
        toast.error(errMsg);
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
      const res = await deleteTestimonial(currentId);
      if (res.success) {
        toast.success('Testimonial deleted successfully');
        setData(prev => prev.filter(d => d.id !== currentId));
        setIsConfirmOpen(false);
        router.refresh();
      } else {
        toast.error('Failed to delete testimonial');
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  const columns = [
    {
      accessorKey: 'personName',
      header: 'Author',
      cell: ({ row }: any) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-3 py-1">
            <Avatar className="w-9 h-9 border border-slate-200">
              <AvatarImage src={item.photoUrl} alt={item.personName} />
              <AvatarFallback className="bg-blue-100 text-blue-800 text-xs font-bold">
                {item.personName ? item.personName.substring(0, 2).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                {item.featured && <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />}
                <span>{item.personName}</span>
              </div>
              <p className="text-xs text-slate-500 truncate">
                {item.designation || 'Participant'}{item.organization ? ` • ${item.organization}` : ''}
              </p>
            </div>
          </div>
        );
      }
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }: any) => {
        const rating = row.original.rating ?? 5;
        return (
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${
                  s <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                }`}
              />
            ))}
            <span className="text-xs font-bold text-slate-600 ml-1">{rating}.0</span>
          </div>
        );
      }
    },
    {
      accessorKey: 'testimonialText',
      header: 'Story / Quote',
      cell: ({ row }: any) => (
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 max-w-sm italic leading-relaxed">
          "{row.original.testimonialText}"
        </p>
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
                : status === 'draft'
                ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {status === 'published' ? '🟢 Published' : status === 'draft' ? '🟡 Pending Review' : '📦 Archived'}
          </Badge>
        );
      }
    },
    {
      id: 'approval',
      header: 'Moderation Action',
      cell: ({ row }: any) => {
        const item = row.original;
        const isPublished = item.status === 'published';
        const isLoading = approvingId === item.id;

        return (
          <Button
            size="sm"
            variant={isPublished ? 'outline' : 'default'}
            disabled={isLoading}
            onClick={() => handleToggleApprove(item.id, item.status)}
            className={`h-8 text-xs font-bold rounded-xl cursor-pointer ${
              isPublished 
                ? 'border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : isPublished ? (
              <>Unpublish</>
            ) : (
              <><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve & Publish</>
            )}
          </Button>
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
            <MessageSquareHeart className="w-7 h-7 text-blue-600" />
            Testimonials & Experience Moderation
          </h2>
          <p className="text-slate-500 mt-1">
            Review user-submitted stories, approve ratings, and curate testimonials displayed on the homepage slider.
          </p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 h-11 rounded-xl cursor-pointer shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Testimonial
        </Button>
      </div>

      {/* Moderation Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80 w-fit">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            filterTab === 'all' 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All ({data.length})
        </button>
        <button
          onClick={() => setFilterTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterTab === 'pending' 
              ? 'bg-amber-500 text-white shadow-sm' 
              : 'text-amber-800 hover:bg-amber-100/60'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Pending Review ({pendingCount})
        </button>
        <button
          onClick={() => setFilterTab('published')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            filterTab === 'published' 
              ? 'bg-emerald-600 text-white shadow-sm' 
              : 'text-emerald-800 hover:bg-emerald-100/60'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Live Published ({publishedCount})
        </button>
      </div>

      {/* Table / Empty State */}
      {filteredData.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <EmptyState 
            title={filterTab === 'pending' ? 'No pending submissions' : 'No testimonials found'} 
            description={filterTab === 'pending' ? 'All submitted testimonials have been reviewed and processed.' : 'Create your first testimonial or wait for users to submit stories.'} 
            actionLabel="Add Testimonial" 
            onAction={() => handleOpenDialog()} 
          />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-2 overflow-hidden">
          <DataTable columns={columns} data={filteredData} searchKey="personName" />
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[540px] bg-white border-slate-200 text-slate-900 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              {currentId ? 'Edit Testimonial' : 'Add Testimonial'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="personName" className="text-slate-900 font-semibold">Author Full Name *</Label>
              <Input 
                id="personName" 
                placeholder="e.g. John Doe"
                value={formData.personName} 
                onChange={(e) => setFormData({...formData, personName: e.target.value})} 
                required 
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="designation" className="text-slate-900 font-semibold">Designation / Role</Label>
                <Input 
                  id="designation" 
                  placeholder="e.g. Student / Lead Fellow"
                  value={formData.designation} 
                  onChange={(e) => setFormData({...formData, designation: e.target.value})} 
                  className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="organization" className="text-slate-900 font-semibold">Organization / College</Label>
                <Input 
                  id="organization" 
                  placeholder="e.g. Youth Foundation"
                  value={formData.organization} 
                  onChange={(e) => setFormData({...formData, organization: e.target.value})} 
                  className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-slate-900 font-semibold">Star Rating (1 - 5)</Label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFormData({...formData, rating: star})}
                    className="p-1 focus:outline-none hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= formData.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {formData.rating} / 5 Stars
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="testimonialText" className="text-slate-900 font-semibold">Testimonial Story / Quote *</Label>
              <Textarea 
                id="testimonialText" 
                placeholder="Write the quote or experience shared by the user..."
                value={formData.testimonialText} 
                onChange={(e) => setFormData({...formData, testimonialText: e.target.value})} 
                rows={4}
                required 
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="photoUrl" className="text-slate-900 font-semibold">Author Photo URL (Optional)</Label>
              <Input 
                id="photoUrl" 
                placeholder="https://... or avatar link"
                value={formData.photoUrl} 
                onChange={(e) => setFormData({...formData, photoUrl: e.target.value})} 
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-slate-900 font-semibold">Publish Status *</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900 rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-900">
                    <SelectItem value="published">🟢 Published (Live on Homepage)</SelectItem>
                    <SelectItem value="draft">🟡 Draft (Hidden / Under Review)</SelectItem>
                    <SelectItem value="archived">📦 Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 my-auto">
                <div className="space-y-0.5">
                  <Label htmlFor="featured" className="text-slate-900 font-bold cursor-pointer">Featured</Label>
                  <p className="text-[11px] text-slate-500">Prioritize in slider</p>
                </div>
                <Switch 
                  id="featured" 
                  checked={formData.featured} 
                  onCheckedChange={(c) => setFormData({...formData, featured: c})} 
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
                {isSubmitting ? 'Saving...' : currentId ? 'Save Changes' : 'Create Testimonial'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog 
        open={isConfirmOpen} 
        onOpenChange={() => setIsConfirmOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Testimonial" 
        description="Are you sure you want to delete this testimonial? This action cannot be undone." 
        destructive
      />
    </div>
  );
}