import { Metadata } from 'next';
import { SettingsForm } from '@/components/admin/settings/settings-form';
import { getSiteSettings, getFeatureFlags } from '@/lib/actions/settings';

export const metadata: Metadata = {
  title: 'Settings | Admin | Youth Empowerment Hub',
};

export default async function SettingsPage() {
  const [settings, flags] = await Promise.all([
    getSiteSettings(),
    getFeatureFlags(),
  ]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Site Settings & Feature Controls</h1>
        <p className="text-slate-500 mt-1">Manage global site configurations, branding, and toggle system features on or off in real time.</p>
      </div>
      <SettingsForm initialSettings={settings} initialFlags={flags} />
    </div>
  );
}