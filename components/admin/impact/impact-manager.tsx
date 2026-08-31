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
import { Plus, Pencil, Trash2, TrendingUp, Sparkles, Loader2 } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { 
  createImpactMetric as createImpact, 
  updateImpactMetric as updateImpact, 
  deleteImpactMetric as deleteImpact 
} from '@/lib/actions/impact';

export default function ImpactManager({ initialData = [] }: { initialData: any[] }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    value: '',
    description: '',
    icon: 'TrendingUp',
    displayOrder: 0,
    status: 'published'
  });

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setCurrentId(item.id);
      setFormData({
        label: item.label || '',
        value: item.value || '',
        description: item.description || '',
        icon: item.icon || 'TrendingUp',
        displayOrder: item.displayOrder || 0,
        status: item.status || 'published'
      });
    } else {
      setCurrentId(null);
      setFormData({
        label: '',
        value: '',
        description: '',
        icon: 'TrendingUp',
        displayOrder: data.length + 1,
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

      const res = currentId ? await updateImpact(currentId, fd) : await createImpact(fd);
      
      if (res.success && res.data) {
        toast.success(currentId ? 'Impact metric updated successfully' : 'Impact metric created successfully');
        if (currentId) {
          setData(prev => prev.map(d => d.id === currentId ? res.data : d));
        } else {
          setData(prev => [...prev, res.data]);
        }
        setIsDialogOpen(false);
        router.refresh();
      } else {
        const errMsg = typeof res.error === 'object' && res.error !== null
          ? Object.entries(res.error).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; ')
          : String(res.error || 'Failed to save impact metric');
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
      const res = await deleteImpact(currentId);
      if (res.success) {
        toast.success('Impact metric deleted successfully');
        setData(prev => prev.filter(d => d.id !== currentId));
        setIsConfirmOpen(false);
        router.refresh();
      } else {
        toast.error('Failed to delete metric');
      }
    } catch {
      toast.error('Delete failed');
    }
  };

  const columns = [
    {
      accessorKey: 'label',
      header: 'Metric Label',
      cell: ({ row }: any) => (
        <div className="font-bold text-slate-900 flex items-center gap-2">
          <span>{row.original.label}</span>
        </div>
      )
    },
    {
      accessorKey: 'value',
      header: 'Metric Value',
      cell: ({ row }: any) => (
        <span className="font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg text-sm border border-blue-100">
          {row.original.value || '—'}
        </span>
      )
    },
    {
      accessorKey: 'displayOrder',
      header: 'Display Order',
      cell: ({ row }: any) => (
        <span className="text-slate-500 font-semibold text-xs">
          #{row.original.displayOrder ?? 0}
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
                : status === 'draft'
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
            <TrendingUp className="w-7 h-7 text-blue-600" />
            Impact Metrics
          </h2>
          <p className="text-slate-500 mt-1">
            Showcase key achievements, numbers reached, and verified organizational outcomes.
          </p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 h-11 rounded-xl cursor-pointer shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Metric
        </Button>
      </div>

      {data.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-sm">
          <EmptyState 
            title="No impact metrics found" 
            description="Add your organization's key statistics (e.g. 5,000+ Students, 50+ Partners)." 
            actionLabel="Add Metric" 
            onAction={() => handleOpenDialog()} 
          />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-2 overflow-hidden">
          <DataTable columns={columns} data={data} searchKey="label" />
        </div>
      )}

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[480px] bg-white border-slate-200 text-slate-900 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              {currentId ? 'Edit Impact Metric' : 'Add Impact Metric'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label htmlFor="label" className="text-slate-900 font-semibold">Metric Label *</Label>
              <Input 
                id="label" 
                placeholder="e.g. Students Reached, Programs Conducted"
                value={formData.label} 
                onChange={(e) => setFormData({...formData, label: e.target.value})} 
                required 
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="value" className="text-slate-900 font-semibold">Value *</Label>
                <Input 
                  id="value" 
                  placeholder="e.g. 5,000+, 25+, 100%"
                  value={formData.value} 
                  onChange={(e) => setFormData({...formData, value: e.target.value})} 
                  required
                  className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="displayOrder" className="text-slate-900 font-semibold">Display Order</Label>
                <Input 
                  id="displayOrder" 
                  type="number" 
                  value={formData.displayOrder} 
                  onChange={(e) => setFormData({...formData, displayOrder: Number(e.target.value)})} 
                  className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-slate-900 font-semibold">Description (Optional)</Label>
              <Textarea 
                id="description" 
                placeholder="Brief contextual detail regarding this metric..."
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                rows={3}
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="icon" className="text-slate-900 font-semibold">Icon Identifier</Label>
                <Input 
                  id="icon" 
                  placeholder="e.g. Users, Award, Globe, BookOpen"
                  value={formData.icon} 
                  onChange={(e) => setFormData({...formData, icon: e.target.value})} 
                  className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="status" className="text-slate-900 font-semibold">Status *</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                  <SelectTrigger className="bg-white border-slate-200 text-slate-900 rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 text-slate-900">
                    <SelectItem value="published">🟢 Published (Live)</SelectItem>
                    <SelectItem value="draft">📝 Draft (Hidden)</SelectItem>
                    <SelectItem value="archived">📦 Archived</SelectItem>
                  </SelectContent>
                </Select>
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
                {isSubmitting ? 'Saving...' : currentId ? 'Save Changes' : 'Create Metric'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog 
        open={isConfirmOpen} 
        onOpenChange={() => setIsConfirmOpen(false)} 
        onConfirm={handleDelete} 
        title="Delete Impact Metric" 
        description="Are you sure you want to delete this impact metric? This action cannot be undone." 
        destructive
      />
    </div>
  );
}