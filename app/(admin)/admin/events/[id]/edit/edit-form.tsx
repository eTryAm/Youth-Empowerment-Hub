"use client";

import { updateEvent } from "@/lib/actions/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, Calendar, Sparkles, CheckCircle2 } from "lucide-react";

export default function EditEventForm({ event }: { event: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function action(formData: FormData) {
    setLoading(true);
    try {
      const result = await updateEvent(event.id, formData);
      if (result.success) {
        toast.success("Event updated successfully");
        router.push("/admin/events");
        router.refresh();
      } else {
        const errDetail = typeof result.error === 'object' && result.error !== null
          ? Object.entries(result.error).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; ')
          : String(result.error || 'Failed to update event');
        toast.error(errDetail || "Error updating event");
      }
    } catch (err) {
      toast.error("An unexpected error occurred while updating event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <form action={action} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-slate-900 font-semibold">Title *</Label>
          <Input 
            id="title" 
            name="title" 
            defaultValue={event.title} 
            required 
            className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-slate-900 font-semibold">Description</Label>
          <Textarea 
            id="description" 
            name="description" 
            defaultValue={event.description || ''} 
            rows={4} 
            className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-slate-900 font-semibold">Start Date *</Label>
            <Input 
              id="date" 
              name="date" 
              type="date" 
              defaultValue={event.date ? new Date(event.date).toISOString().split('T')[0] : ''} 
              required 
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-slate-900 font-semibold">End Date (Optional)</Label>
            <Input 
              id="endDate" 
              name="endDate" 
              type="date" 
              defaultValue={event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : ''} 
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="time" className="text-slate-900 font-semibold">Time</Label>
            <Input 
              id="time" 
              name="time" 
              defaultValue={event.time || ''} 
              placeholder="e.g. 10:00 AM - 1:00 PM"
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="venue" className="text-slate-900 font-semibold">Venue / Location</Label>
            <Input 
              id="venue" 
              name="venue" 
              defaultValue={event.venue || ''} 
              placeholder="e.g. Innovation Hall / Online"
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="district" className="text-slate-900 font-semibold">District</Label>
            <Input 
              id="district" 
              name="district" 
              defaultValue={event.district || ''} 
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state" className="text-slate-900 font-semibold">State</Label>
            <Input 
              id="state" 
              name="state" 
              defaultValue={event.state || ''} 
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-slate-900 font-semibold">Category</Label>
            <Input 
              id="category" 
              name="category" 
              defaultValue={event.category || ''} 
              placeholder="e.g. Technology, Skill Development"
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status" className="text-slate-900 font-semibold">Publish Status *</Label>
            <select 
              name="status" 
              id="status" 
              defaultValue={event.status || 'draft'} 
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="draft">📝 Draft (Hidden from public)</option>
              <option value="published">🟢 Published (Live on site)</option>
              <option value="archived">📦 Archived</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="registrationUrl" className="text-slate-900 font-semibold">Registration URL</Label>
          <Input 
            id="registrationUrl" 
            name="registrationUrl" 
            type="url" 
            defaultValue={event.registrationUrl || ''} 
            placeholder="https://..."
            className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl" className="text-slate-900 font-semibold">Cover Image URL</Label>
          <Input 
            id="imageUrl" 
            name="imageUrl" 
            defaultValue={event.imageUrl || ''} 
            placeholder="https://... or /images/..."
            className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
          />
        </div>

        <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <Switch id="featured" name="featured" value="true" defaultChecked={event.featured ?? false} />
          <div className="space-y-0.5">
            <Label htmlFor="featured" className="text-slate-900 font-bold cursor-pointer">Featured Event</Label>
            <p className="text-xs text-slate-500">Highlight this event in banners and primary listings.</p>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/admin/events')}
            className="rounded-xl border-slate-200 font-semibold"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={loading} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-11 rounded-xl shadow-md cursor-pointer"
          >
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
            {loading ? "Saving Changes..." : "Save Event"}
          </Button>
        </div>
      </form>
    </div>
  );
}