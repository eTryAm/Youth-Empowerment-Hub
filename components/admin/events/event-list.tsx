"use client";

import * as React from "react";
import { DataTable } from "@/components/admin/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Edit, Trash, Star, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { deleteEvent, toggleEventFeatured, archiveEvent } from "@/lib/actions/events";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export function EventList({ data }: { data: any[] }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [eventToDelete, setEventToDelete] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const val = row.getValue("date");
        return val ? format(new Date(val as string), "PPP") : "N/A";
      },
    },
    {
      accessorKey: "venue",
      header: "Venue",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge variant={status === 'published' ? 'default' : 'secondary'}>{status}</Badge>;
      },
    },
    {
      accessorKey: "featured",
      header: "Featured",
      cell: ({ row }) => (
        row.getValue("featured") ? <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> : null
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const event = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link href={`/admin/events/${event.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                const res = await toggleEventFeatured(event.id);
                if (res.success) {
                  toast.success("Event featured status updated");
                }
              }}>
                <Star className="mr-2 h-4 w-4" /> Toggle Featured
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                const res = await archiveEvent(event.id);
                if (res.success) {
                  toast.success("Event archived");
                }
              }}>
                <Archive className="mr-2 h-4 w-4" /> Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  setEventToDelete(event.id);
                  setDeleteOpen(true);
                }}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="title" 
        statusFilter={{
          column: "status",
          options: [
            { label: "Published", value: "published" },
            { label: "Draft", value: "draft" },
            { label: "Cancelled", value: "cancelled" },
            { label: "Completed", value: "completed" },
          ]
        }}
      />
      
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Event"
        description="Are you sure you want to delete this event? This action cannot be undone."
        confirmLabel="Delete"
        destructive={true}
        loading={loading}
        onConfirm={async () => {
          if (!eventToDelete) return;
          setLoading(true);
          try {
            const res = await deleteEvent(eventToDelete);
            if (res.success) {
              toast.success("Event deleted successfully");
              setDeleteOpen(false);
            } else {
              toast.error("Failed to delete event");
            }
          } catch (e) {
            toast.error("An error occurred");
          } finally {
            setLoading(false);
          }
        }}
      />
    </>
  );
}
