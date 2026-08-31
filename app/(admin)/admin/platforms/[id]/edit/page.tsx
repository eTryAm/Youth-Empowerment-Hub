import { db } from "@/lib/db";
import { platforms } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import EditPlatformForm from "./edit-form";

interface EditPlatformPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlatformPage(props: EditPlatformPageProps) {
  const { id } = await props.params;

  const [platform] = await db.select().from(platforms).where(eq(platforms.id, id));

  if (!platform) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Platform</h1>
      </div>
      <EditPlatformForm platform={platform} />
    </div>
  );
}
