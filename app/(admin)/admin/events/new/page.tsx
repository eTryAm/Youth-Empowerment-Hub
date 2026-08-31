"use client";

import { createEvent } from "@/lib/actions/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2, CalendarPlus, CheckCircle2 } from "lucide-react";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function action(formData: FormData) {
    setLoading(true);
    try {
      const result = await createEvent(formData);
      if (result.success) {
        toast.success("Event created successfully");
        router.push("/admin/events");
        router.refresh();
      } else {
        const errDetail = typeof result.error === 'object' && result.error !== null
          ? Object.entries(result.error).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; ')
          : String(result.error || 'Failed to create event');
        toast.error(errDetail || "Error creating event");
      }
    } catch (err) {
      toast.error("An unexpected error occurred while creating event");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
          <CalendarPlus className="w-7 h-7 text-blue-600" />
          Create New Event
        </h1>
        <p className="text-slate-500 mt-1">Add a new event, seminar, workshop, or program to the schedule.</p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <form action={action} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-900 font-semibold">Event Title *</Label>
            <Input 
              id="title" 
              name="title" 
              placeholder="e.g. Youth Leadership & AI Workshop"
              required 
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-900 font-semibold">Description</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Provide a detailed overview of what attendees will learn or experience..."
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
                placeholder="e.g. 10:00 AM - 1:00 PM"
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue" className="text-slate-900 font-semibold">Venue / Location</Label>
              <Input 
                id="venue" 
                name="venue" 
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
                placeholder="e.g. Central"
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-slate-900 font-semibold">State</Label>
              <Input 
                id="state" 
                name="state" 
                placeholder="e.g. State"
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
                placeholder="e.g. Technology, Education, Sports"
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status" className="text-slate-900 font-semibold">Publish Status *</Label>
              <select 
                name="status" 
                id="status" 
                defaultValue="published"
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="published">🟢 Published (Live on site)</option>
                <option value="draft">📝 Draft (Hidden from public)</option>
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
              placeholder="https://..."
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-slate-900 font-semibold">Cover Image URL</Label>
            <Input 
              id="imageUrl" 
              name="imageUrl" 
              placeholder="https://... or /images/..."
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 rounded-xl"
            />
          </div>

          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <Switch id="featured" name="featured" value="true" />
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
              {loading ? "Creating Event..." : "Create Event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}