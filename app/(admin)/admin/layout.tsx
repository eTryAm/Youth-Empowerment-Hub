import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/sidebar';
import { AdminTopBar } from '@/components/admin/top-bar';

export default async function AdminLayout({ children }: LayoutProps<'/admin'>) {
  const user = await requireAuth();
  
  // If user has no admin role (viewer is minimum), redirect
  if (!user || (user.role !== 'super_admin' && user.role !== 'content_admin' && user.role !== 'viewer')) {
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <AdminSidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminTopBar user={user} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
