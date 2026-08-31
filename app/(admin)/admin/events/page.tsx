import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { requirePermission } from "@/lib/auth";
import { desc } from "drizzle-orm";
import { EventList } from "@/components/admin/events/event-list";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  await requirePermission("events.view");
  
  const data = await db.select().from(events).orderBy(desc(events.date), desc(events.createdAt)) as any[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Event Management</h1>
        <Button asChild>
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Link>
        </Button>
      </div>
      <EventList data={data} />
    </div>
  );
}
