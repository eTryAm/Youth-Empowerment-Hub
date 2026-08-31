'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { updateSiteSetting, toggleFeatureFlag } from '@/lib/actions/settings';
import { toast } from 'sonner';
import { Loader2, Sparkles, Sliders, Globe, Share2, FileText, CheckCircle2 } from 'lucide-react';

interface SettingsFormProps {
  initialSettings: Record<string, string | null>;
  initialFlags: Record<string, boolean>;
}

const FEATURE_LIST = [
  {
    key: 'opportunities_enabled',
    label: 'Opportunities Platform Gateway',
    description: 'Enables the main gateway window for youth internships, jobs, and career programs.',
  },
  {
    key: 'events_enabled',
    label: 'Events & Workshops Section',
    description: 'Shows the upcoming events schedule, workshops, and registration details.',
  },
  {
    key: 'gallery_enabled',
    label: 'Event Gallery & Glimpses Section',
    description: 'Displays real event glimpses, workshop photos, video clips, and media highlights.',
  },
  {
    key: 'get_involved_enabled',
    label: 'Partner With Us / Institutional Section',
    description: 'Enables institutional and corporate partnership contact routing on the homepage.',
  },
  {
    key: 'testimonials_enabled',
    label: 'Community Testimonials',
    description: 'Displays youth and partner testimonials on the public homepage.',
  },
  {
    key: 'partners_enabled',
    label: 'Partner Logos & Affiliations',
    description: 'Displays collaborating organization logos on the public website.',
  },
  {
    key: 'announcements_enabled',
    label: 'Top Announcement Banner',
    description: 'Shows the high-priority announcement alert bar at the very top of the site.',
  },
  {
    key: 'donation_enabled',
    label: 'Donations & Support CTA',
    description: 'Enables the donation and community mission support section.',
  },
  {
    key: 'contact_form_enabled',
    label: 'Public Contact Form',
    description: 'Enables the public message submission form on the contact page.',
  },
];

export function SettingsForm({ initialSettings, initialFlags }: SettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [flags, setFlags] = useState(initialFlags);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const [key, value] of Object.entries(settings)) {
        if (value !== initialSettings[key]) {
          await updateSiteSetting(key, value || '');
        }
      }
      toast.success('Site settings updated successfully');
    } catch (error) {
      toast.error('Failed to update site settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFlag = async (key: string, currentState: boolean) => {
    const nextState = !currentState;
    setFlags((prev) => ({ ...prev, [key]: nextState }));

    try {
      const res = await toggleFeatureFlag(key, nextState);
      if (res.success) {
        toast.success(`Feature updated: ${nextState ? 'Enabled' : 'Disabled'}`);
      } else {
        toast.error('Failed to update feature flag');
      }
    } catch (error) {
      toast.error('An error occurred updating the feature');
    }
  };

  return (
    <Tabs defaultValue="features" className="w-full">
      <TabsList className="bg-slate-100 border border-slate-200 p-1.5 rounded-2xl mb-6 flex flex-wrap gap-1">
        <TabsTrigger
          value="features"
          className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-slate-700 font-semibold px-4 py-2 rounded-xl text-sm transition-all"
        >
          <Sliders className="w-4 h-4 mr-2" />
          Feature Controls
        </TabsTrigger>
        <TabsTrigger
          value="general"
          className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-slate-700 font-semibold px-4 py-2 rounded-xl text-sm transition-all"
        >
          <Globe className="w-4 h-4 mr-2" />
          General & Identity
        </TabsTrigger>
        <TabsTrigger
          value="social"
          className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-slate-700 font-semibold px-4 py-2 rounded-xl text-sm transition-all"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Social Links
        </TabsTrigger>
        <TabsTrigger
          value="content"
          className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-slate-700 font-semibold px-4 py-2 rounded-xl text-sm transition-all"
        >
          <FileText className="w-4 h-4 mr-2" />
          Footer & Legal
        </TabsTrigger>
      </TabsList>

      {/* Feature Flags Tab */}
      <TabsContent value="features" className="space-y-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Dynamic Feature Toggles
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Add or remove features across the public site instantly without modifying code.
            </p>
          </div>

          <div className="grid gap-4">
            {FEATURE_LIST.map((feature) => {
              const isEnabled = flags[feature.key] ?? false;
              return (
                <div
                  key={feature.key}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-blue-200 hover:bg-blue-50/20 transition-all"
                >
                  <div className="space-y-1 max-w-xl pr-4">
                    <div className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                      {feature.label}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          isEnabled
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isEnabled ? 'Live' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <Switch
                    checked={isEnabled}
                    onCheckedChange={() => handleToggleFlag(feature.key, isEnabled)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </TabsContent>

      {/* General Settings Tab */}
      <TabsContent value="general" className="space-y-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Organization Profile & Details</h3>
            <p className="text-sm text-slate-500 mt-1">Configure the official branding, contact points, and identity.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="org_name" className="text-slate-900 font-semibold">Organization Name</Label>
            <Input
              id="org_name"
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500"
              value={settings.org_name || ''}
              onChange={(e) => handleChange('org_name', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="tagline" className="text-slate-900 font-semibold">Tagline / Mission Slogan</Label>
            <Input
              id="tagline"
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500"
              value={settings.tagline || ''}
              onChange={(e) => handleChange('tagline', e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="contact_email" className="text-slate-900 font-semibold">Contact Email</Label>
              <Input
                id="contact_email"
                type="email"
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500"
                value={settings.contact_email || ''}
                onChange={(e) => handleChange('contact_email', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact_phone" className="text-slate-900 font-semibold">Contact Phone</Label>
              <Input
                id="contact_phone"
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500"
                value={settings.contact_phone || ''}
                onChange={(e) => handleChange('contact_phone', e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address" className="text-slate-900 font-semibold">Headquarters / Physical Address</Label>
            <Textarea
              id="address"
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 min-h-[100px]"
              value={settings.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
            />
          </div>
        </div>
      </TabsContent>

      {/* Social Media Tab */}
      <TabsContent value="social" className="space-y-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Official Social Media Profiles</h3>
            <p className="text-sm text-slate-500 mt-1">Connect your organization's social links displayed across headers and footers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="social_instagram" className="text-slate-900 font-semibold">Instagram Profile URL</Label>
              <Input
                id="social_instagram"
                placeholder="https://instagram.com/your_handle"
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500"
                value={settings.social_instagram || ''}
                onChange={(e) => handleChange('social_instagram', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="social_youtube" className="text-slate-900 font-semibold">YouTube Channel URL</Label>
              <Input
                id="social_youtube"
                placeholder="https://youtube.com/@your_channel"
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500"
                value={settings.social_youtube || ''}
                onChange={(e) => handleChange('social_youtube', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="social_linkedin" className="text-slate-900 font-semibold">LinkedIn Page URL</Label>
              <Input
                id="social_linkedin"
                placeholder="https://linkedin.com/company/your_org"
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500"
                value={settings.social_linkedin || ''}
                onChange={(e) => handleChange('social_linkedin', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="social_facebook" className="text-slate-900 font-semibold">Facebook Page URL</Label>
              <Input
                id="social_facebook"
                placeholder="https://facebook.com/your_page"
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500"
                value={settings.social_facebook || ''}
                onChange={(e) => handleChange('social_facebook', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="social_twitter" className="text-slate-900 font-semibold">X (Twitter) URL</Label>
              <Input
                id="social_twitter"
                placeholder="https://x.com/your_handle"
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500"
                value={settings.social_twitter || ''}
                onChange={(e) => handleChange('social_twitter', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="social_discord" className="text-slate-900 font-semibold">Discord Server Invite URL</Label>
              <Input
                id="social_discord"
                placeholder="https://discord.gg/your_server"
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500"
                value={settings.social_discord || ''}
                onChange={(e) => handleChange('social_discord', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="social_whatsapp" className="text-slate-900 font-semibold">WhatsApp Community / Channel URL</Label>
              <Input
                id="social_whatsapp"
                placeholder="https://chat.whatsapp.com/... or channel link"
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500"
                value={settings.social_whatsapp || ''}
                onChange={(e) => handleChange('social_whatsapp', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="social_github" className="text-slate-900 font-semibold">GitHub Organization URL</Label>
              <Input
                id="social_github"
                placeholder="https://github.com/your_org"
                className="bg-white border-slate-200 text-slate-900 focus:border-blue-500"
                value={settings.social_github || ''}
                onChange={(e) => handleChange('social_github', e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="social_telegram" className="text-slate-900 font-semibold">Telegram Channel URL</Label>
            <Input
              id="social_telegram"
              placeholder="https://t.me/your_channel"
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500"
              value={settings.social_telegram || ''}
              onChange={(e) => handleChange('social_telegram', e.target.value)}
            />
          </div>
        </div>
      </TabsContent>

      {/* Content & Legal Tab */}
      <TabsContent value="content" className="space-y-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-bold text-slate-900">Footer Content & Legal Notice</h3>
            <p className="text-sm text-slate-500 mt-1">Configure footer blurbs and copyright text.</p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="footer_text" className="text-slate-900 font-semibold">Footer Description</Label>
            <Textarea
              id="footer_text"
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500 min-h-[100px]"
              value={settings.footer_text || ''}
              onChange={(e) => handleChange('footer_text', e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="copyright_text" className="text-slate-900 font-semibold">Copyright Notice</Label>
            <Input
              id="copyright_text"
              className="bg-white border-slate-200 text-slate-900 focus:border-blue-500"
              value={settings.copyright_text || ''}
              onChange={(e) => handleChange('copyright_text', e.target.value)}
            />
          </div>
        </div>
      </TabsContent>

      <div className="mt-6 flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-2.5 rounded-2xl shadow-md cursor-pointer"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
          Save Site Settings
        </Button>
      </div>
    </Tabs>
  );
}