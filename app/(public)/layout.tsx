import { Header } from '@/components/public/header';
import { Footer } from '@/components/public/footer';
import { AnnouncementsBar } from '@/components/public/announcements-bar';
import {
  getActiveAnnouncement,
  getAllPublishedAnnouncements,
  getPublicFeatureFlags,
  getPublicNavItems,
  getPublicSettings,
} from '@/lib/public/queries';
import { siteConfig } from '@/config/site';

export default async function PublicLayout({ children }: LayoutProps<'/'>) {
  const [navItems, settings, flags, announcement, allAnnouncements] = await Promise.all([
    getPublicNavItems(),
    getPublicSettings(),
    getPublicFeatureFlags(),
    getActiveAnnouncement(),
    getAllPublishedAnnouncements(10),
  ]);

  const siteName = settings.org_name || siteConfig.name;
  const showAnnouncement = flags.announcements_enabled !== false;

  return (
    <div className="flex flex-col min-h-screen">
      {showAnnouncement && announcement ? (
        <AnnouncementsBar
          announcement={{
            title: announcement.title,
            description: announcement.description ?? undefined,
            externalUrl: announcement.externalUrl ?? undefined,
          }}
        />
      ) : null}
      <Header 
        navItems={navItems} 
        siteName={siteName} 
        notifications={allAnnouncements} 
      />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
