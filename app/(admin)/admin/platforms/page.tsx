import { db } from "@/lib/db";
import { platforms } from "@/lib/db/schema";
import { requirePermission } from "@/lib/auth";
import { desc } from "drizzle-orm";
import { PlatformList } from "@/components/admin/platforms/platform-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function PlatformsPage() {
  await requirePermission("platforms.view");
  
  const data = await db.select().from(platforms).orderBy(desc(platforms.displayOrder), desc(platforms.createdAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Platform Management</h1>
        <Button asChild>
          <Link href="/admin/platforms/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Platform
          </Link>
        </Button>
      </div>
      <PlatformList data={data} />
    </div>
  );
}
