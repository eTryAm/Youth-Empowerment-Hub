'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import {
  createGetInvolvedLink as createGetInvolved,
  updateGetInvolvedLink as updateGetInvolved,
  deleteGetInvolvedLink as deleteGetInvolved,
} from '@/lib/actions/get-involved';

const emptyForm = {
  title: '',
  description: '',
  icon: '',
  url: '',
  urlType: 'internal',
  displayOrder: 0,
  status: 'published',
};

export default function GetInvolvedManager({ initialData = [] }: { initialData: any[] }) {
  const router = useRouter();
  const data = initialData;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setCurrentId(item.id);
      setFormData({
        title: item.title || '',
        description: item.description || '',
        icon: item.icon || '',
        url: item.url || '',
        urlType: item.urlType || 'internal',
        displayOrder: item.displayOrder || 0,
        status: item.status || 'published',
      });
    } else {
      setCurrentId(null);
      setFormData(emptyForm);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== undefined && v !== null) fd.append(k, String(v));
      });
      const result = currentId
        ? await updateGetInvolved(currentId, fd)
        : await createGetInvolved(fd);
      if (!result.success) {
        toast.error('Please check the form and try again.');
        return;
      }
      toast.success(currentId ? 'Option updated' : 'Option created');
      setIsDialogOpen(false);
      router.refresh();
    } catch {
      toast.error('Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentId) return;
    try {
      await deleteGetInvolved(currentId);
      toast.success('Option deleted');
      setIsConfirmOpen(false);
      router.refresh();
    } catch {
      toast.error('Delete failed');
    }
  };

  const columns = [
    { accessorKey: 'title', header: 'Title' },
    {
      accessorKey: 'urlType',
      header: 'URL Type',
      cell: ({ row }: any) => <Badge variant="outline">{row.original.urlType}</Badge>,
    },
    {
      accessorKey: 'url',
      header: 'URL',
      cell: ({ row }: any) => {
        const url = (row.original.url as string | null) || '';
        return <span title={url}>{url ? (url.length > 30 ? `${url.slice(0, 30)}…` : url) : 'Contact form fallback'}</span>;
      },
    },
    { accessorKey: 'displayOrder', header: 'Order' },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => (
        <Badge variant={row.original.status === 'published' ? 'default' : 'secondary'}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(row.original)}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCurrentId(row.original.id);
              setIsConfirmOpen(true);
            }}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Get Involved</h2>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Add Option
        </Button>
      </div>

      {data.length === 0 ? (
        <EmptyState
          title="No options found"
          description="Get started by adding a new way to get involved."
          actionLabel="Add option"
          onAction={() => handleOpenDialog()}
        />
      ) : (
        <DataTable columns={columns} data={data} searchKey="title" />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentId ? 'Edit Option' : 'Add Option'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="urlType">URL Type</Label>
                <Select value={formData.urlType} onValueChange={(v) => setFormData({ ...formData, urlType: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="internal">Internal</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                    <SelectItem value="google_form">Google Form</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL (optional for internal)</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="/contact or https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon Name</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="Users, HandHeart, GraduationCap"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isConfirmOpen}
        onOpenChange={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Are you sure?"
        description="This action cannot be undone."
      />
    </div>
  );
}
