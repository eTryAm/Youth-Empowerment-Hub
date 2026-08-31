import { db } from "@/lib/db";
import { events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditEventForm from "./edit-form";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage(props: EditEventPageProps) {
  const { id } = await props.params;

  const [event] = await db.select().from(events).where(eq(events.id, id));

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Event</h1>
      </div>
      <EditEventForm event={event} />
    </div>
  );
}
