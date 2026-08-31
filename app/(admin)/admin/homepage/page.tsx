import { Metadata } from 'next';
import { HomepageBuilder } from '@/components/admin/homepage/homepage-builder';
import { getHomepageSections } from '@/lib/actions/settings';

export const metadata: Metadata = {
  title: 'Homepage Builder | Admin | Youth Empowerment Hub',
};

export default async function HomepageBuilderPage() {
  const sections = await getHomepageSections();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Homepage Builder</h1>
        <p className="text-slate-500 mt-1">Manage section visibility and display order on the public homepage.</p>
      </div>
      <HomepageBuilder initialSections={sections} />
    </div>
  );
}