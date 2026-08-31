"use client";

import { createPlatform } from "@/lib/actions/platforms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

export default function NewPlatformPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function action(formData: FormData) {
    setLoading(true);
    const result = await createPlatform(formData);
    setLoading(false);

    if (result.success) {
      toast.success("Platform created successfully");
      router.push("/admin/platforms");
    } else {
      toast.error("Error creating platform");
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Platform</h1>
      </div>
      <form action={action} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" placeholder="Auto-generated if empty" />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Short Description</Label>
          <Textarea id="description" name="description" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longDescription">Long Description</Label>
          <Textarea id="longDescription" name="longDescription" rows={5} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input id="url" name="url" type="url" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input id="logo" name="logo" type="url" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL</Label>
            <Input id="coverImage" name="coverImage" type="url" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select name="category" id="category" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="Education">Education</option>
              <option value="Technology">Technology</option>
              <option value="Sports">Sports</option>
              <option value="Career">Career</option>
              <option value="Community">Community</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select name="status" id="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="draft">Draft</option>
              <option value="live">Live</option>
              <option value="coming_soon">Coming Soon</option>
              <option value="under_development">Under Development</option>
              <option value="temporarily_unavailable">Temporarily Unavailable</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="displayOrder">Display Order</Label>
            <Input id="displayOrder" name="displayOrder" type="number" defaultValue="0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <Input id="accentColor" name="accentColor" type="color" defaultValue="#3B82F6" className="h-10 p-1" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="featured" name="featured" value="true" />
          <Label htmlFor="featured">Featured Platform</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="openInNewTab" name="openInNewTab" value="true" defaultChecked />
          <Label htmlFor="openInNewTab">Open URL in New Tab</Label>
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Platform"}
        </Button>
      </form>
    </div>
  );
}
