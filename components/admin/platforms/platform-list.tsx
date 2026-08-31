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
import { deletePlatform, togglePlatformFeatured, archivePlatform } from "@/lib/actions/platforms";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function PlatformList({ data }: { data: any[] }) {
  const router = useRouter();
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [platformToDelete, setPlatformToDelete] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge variant={status === 'live' ? 'default' : 'secondary'}>{status}</Badge>;
      },
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "featured",
      header: "Featured",
      cell: ({ row }) => (
        row.getValue("featured") ? <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> : null
      ),
    },
    {
      accessorKey: "displayOrder",
      header: "Order",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const platform = row.original;

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
                <Link href={`/admin/platforms/${platform.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                const res = await togglePlatformFeatured(platform.id);
                if (res.success) {
                  toast.success("Platform featured status updated");
                }
              }}>
                <Star className="mr-2 h-4 w-4" /> Toggle Featured
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                const res = await archivePlatform(platform.id);
                if (res.success) {
                  toast.success("Platform archived");
                }
              }}>
                <Archive className="mr-2 h-4 w-4" /> Archive
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  setPlatformToDelete(platform.id);
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
        searchKey="name" 
        statusFilter={{
          column: "status",
          options: [
            { label: "Live", value: "live" },
            { label: "Draft", value: "draft" },
            { label: "Coming Soon", value: "coming_soon" },
          ]
        }}
      />
      
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Platform"
        description="Are you sure you want to delete this platform? This action cannot be undone."
        confirmLabel="Delete"
        destructive={true}
        loading={loading}
        onConfirm={async () => {
          if (!platformToDelete) return;
          setLoading(true);
          try {
            const res = await deletePlatform(platformToDelete);
            if (res.success) {
              toast.success("Platform deleted successfully");
              setDeleteOpen(false);
            } else {
              toast.error("Failed to delete platform");
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
