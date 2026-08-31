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
import { createObjective, updateObjective, deleteObjective } from '@/lib/actions/objectives';

export default function ObjectiveManager({ initialData = [] }: { initialData: any[] }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    text: '',
    category: 'education_skills',
    icon: '',
    displayOrder: 0,
    status: 'active'
  });

  const handleOpenDialog = (item?: any) => {
    if (item) {
      setCurrentId(item.id);
      setFormData({
        text: item.text || '',
        category: item.category || 'education_skills',
        icon: item.icon || '',
        displayOrder: item.displayOrder || 0,
        status: item.status || 'active'
      });
    } else {
      setCurrentId(null);
      setFormData({
        text: '',
        category: 'education_skills',
        icon: '',
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
        await updateObjective(currentId, fd);
        toast.success('Objective updated');
      } else {
        await createObjective(fd);
        toast.success('Objective created');
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
      await deleteObjective(currentId);
      toast.success('Objective deleted');
      setIsConfirmOpen(false);
      router.refresh();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const columns = [
    {
      accessorKey: 'text',
      header: 'Text',
      cell: ({ row }: any) => {
        const text = row.original.text as string;
        return <span title={text}>{text.length > 80 ? text.substring(0, 80) + '...' : text}</span>;
      }
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }: any) => <Badge variant="outline">{row.original.category}</Badge>
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
        <h2 className="text-3xl font-bold tracking-tight">Objectives</h2>
        <Button onClick={() => handleOpenDialog()}><Plus className="w-4 h-4 mr-2" /> Add Objective</Button>
      </div>

      {data.length === 0 ? (
        <EmptyState title="No objectives found" description="Get started by adding a new objective." actionLabel="" onAction={() => setIsDialogOpen(true)} />
      ) : (
        <DataTable columns={columns} data={data} searchKey="text" />
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentId ? 'Edit Objective' : 'Add Objective'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Text</Label>
              <Textarea id="text" value={formData.text} onChange={(e) => setFormData({...formData, text: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="education_skills">Education & Skills</SelectItem>
                  <SelectItem value="career_opportunities">Career Opportunities</SelectItem>
                  <SelectItem value="technology_innovation">Technology & Innovation</SelectItem>
                  <SelectItem value="community_welfare">Community Welfare</SelectItem>
                  <SelectItem value="collaboration">Collaboration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon Name</Label>
                <Input id="icon" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} />
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
        description="This action cannot be undone. This will permanently delete the objective." 
      />
    </div>
  );
}
