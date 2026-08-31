'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, Trash2, Archive, Check, Reply } from 'lucide-react';
import { DataTable } from '@/components/admin/data-table';
import { ConfirmDialog } from '@/components/admin/confirm-dialog';
import { EmptyState } from '@/components/admin/empty-state';
import { updateContactStatus, deleteContactSubmission } from '@/lib/actions/contact-admin';

export default function ContactManager({ initialData = [] }: { initialData: any[] }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [filter, setFilter] = useState('all');
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filteredData = filter === 'all' ? data : data.filter((item) => item.status === filter);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateContactStatus(id, newStatus as any);
      toast.success(`Marked as ${newStatus}`);
      router.refresh();
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem({ ...selectedItem, status: newStatus });
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteContactSubmission(selectedItem.id);
      toast.success('Submission deleted');
      setIsConfirmOpen(false);
      setIsViewOpen(false);
      router.refresh();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const columns = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }: any) => (
        <div className="flex items-center gap-2">
          {row.original.status === 'new' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
          {row.original.name}
        </div>
      )
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'subject',
      header: 'Subject',
      cell: ({ row }: any) => {
        const sub = row.original.subject as string;
        return <span title={sub}>{sub?.length > 20 ? sub.substring(0, 20) + '...' : sub}</span>;
      }
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }: any) => <Badge variant="outline">{row.original.category}</Badge>
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }: any) => {
        const status = row.original.status;
        let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
        if (status === 'new') variant = 'default';
        if (status === 'read') variant = 'secondary';
        if (status === 'archived') variant = 'destructive';
        
        return <Badge variant={variant}>{status}</Badge>;
      }
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }: any) => new Date(row.original.createdAt).toLocaleDateString()
    },
    {
      id: 'actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={() => {
            setSelectedItem(row.original);
            setIsViewOpen(true);
            if (row.original.status === 'new') {
              handleStatusChange(row.original.id, 'read');
            }
          }}><Eye className="w-4 h-4" /></Button>
          <Button variant="ghost" size="sm" onClick={() => { setSelectedItem(row.original); setIsConfirmOpen(true); }}><Trash2 className="w-4 h-4 text-red-500" /></Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Contact Submissions</h2>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Submissions</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="read">Read</SelectItem>
            <SelectItem value="replied">Replied</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredData.length === 0 ? (
        <EmptyState title="No submissions found" description="There are no contact submissions matching your filter." />
      ) : (
        <DataTable columns={columns} data={filteredData} searchKey="name" />
      )}

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Name:</span> {selectedItem.name}
                </div>
                <div>
                  <span className="font-semibold">Email:</span> <a href={`mailto:${selectedItem.email}`} className="text-blue-500 hover:underline">{selectedItem.email}</a>
                </div>
                <div>
                  <span className="font-semibold">Phone:</span> {selectedItem.phone || 'N/A'}
                </div>
                <div>
                  <span className="font-semibold">Date:</span> {new Date(selectedItem.createdAt).toLocaleString()}
                </div>
                <div>
                  <span className="font-semibold">Category:</span> {selectedItem.category}
                </div>
                <div>
                  <span className="font-semibold">Status:</span> <Badge>{selectedItem.status}</Badge>
                </div>
              </div>
              <div className="pt-4 border-t">
                <span className="font-semibold block mb-2">Subject: {selectedItem.subject}</span>
                <div className="bg-muted p-4 rounded-md whitespace-pre-wrap text-sm">
                  {selectedItem.message}
                </div>
              </div>
              <DialogFooter className="flex justify-between sm:justify-between items-center mt-6 border-t pt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleStatusChange(selectedItem.id, 'read')} disabled={selectedItem.status === 'read'}>
                    <Check className="w-4 h-4 mr-2" /> Mark Read
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleStatusChange(selectedItem.id, 'replied')} disabled={selectedItem.status === 'replied'}>
                    <Reply className="w-4 h-4 mr-2" /> Mark Replied
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleStatusChange(selectedItem.id, 'archived')} disabled={selectedItem.status === 'archived'}>
                    <Archive className="w-4 h-4 mr-2" /> Archive
                  </Button>
                </div>
                <Button variant="destructive" size="sm" onClick={() => setIsConfirmOpen(true)}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog 
        open={isConfirmOpen} 
        onOpenChange={() => setIsConfirmOpen(false)} 
        onConfirm={handleDelete} 
        title="Are you sure?" 
        description="This action cannot be undone. This will permanently delete the submission." 
      />
    </div>
  );
}
