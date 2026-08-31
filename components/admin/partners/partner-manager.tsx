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
import { createPartner, updatePartner, deletePartner } from '@/lib/actions/partners';

export default function PartnerManager({ initialData = [] }: { initialData: any[] }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    logoUrl: '',
    website: '',
    description: '',
    partnershipType: '',
    displayOrder: 0,
    status: 'active'
  });

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setCurrentId(item.id);
      setFormData({
        name: item.name || '',
        logoUrl: item.logoUrl || '',
        website: item.website || '',
        description: item.description || '',
        partnershipType: item.partnershipType || '',
        displayOrder: item.displayOrder || 0,
        status: item.status || 'active'
      });
    } else {
      setCurrentId(null);
      setFormData({
        name: '',
        logoUrl: '',
        website: '',
        description: '',
        partnershipType: '',
        displayOrder: 0,
        status: 'active'
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
          fd.append(k, typeof v === 'boolean' ? (v ? 'on' : 'off') : String(v));
        }
      });
      if (currentId) {
        await updatePartner(currentId, fd);
        toast.success('Partner updated');
      } else {
        await createPartner(fd);
        toast.success('Partner created');
      }
      setIsDialogOpen(false);
      router.refresh();
    } catch (error) {
      toast.error('Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!currentId) return;
    try {
      await deletePartner(currentId);
      toast.success('Partner deleted');
      setIsConfirmOpen(false);
      router.refresh();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
    },
    {
      accessorKey: 'partnershipType',
      header: 'Type',
    },
    {
      accessorKey: 'website',
      header: 'Website',
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
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        );
      }
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(row.original)}><Pencil className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => { setCurrentId(row.original.id); setIsConfirmOpen(true); }}><Trash2 className="w-4 h-4 text-red-500" /></Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Partners</h2>
        <Button onClick={() => handleOpenDialog()}><Plus className="w-4 h-4 mr-2" /> Add Partner</Button>
      </div>

      {data.length === 0 ? (
        <EmptyState title="No partners found" description="Get started by adding a new partner." actionLabel="" onAction={() => setIsDialogOpen(true)} />
      ) : (
        <DataTable columns={columns} data={data} searchKey="name" />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentId ? 'Edit Partner' : 'Add Partner'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input id="logoUrl" value={formData.logoUrl} onChange={(e) => setFormData({...formData, logoUrl: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partnershipType">Type</Label>
                <Input id="partnershipType" value={formData.partnershipType} onChange={(e) => setFormData({...formData, partnershipType: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input id="displayOrder" type="number" value={formData.displayOrder} onChange={(e) => setFormData({...formData, displayOrder: Number(e.target.value)})} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({...formData, status: v})}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={isConfirmOpen} 
        onOpenChange={() => setIsConfirmOpen(false)} 
        onConfirm={handleDelete} 
        title="Are you sure?" 
        description="This action cannot be undone. This will permanently delete the partner." 
      />
    </div>
  );
}
