import { Metadata } from 'next';
import { UserList } from '@/components/admin/users/user-list';
import { getAdminUsers } from '@/lib/actions/users';

export const metadata: Metadata = {
  title: 'Users | Admin | Youth Empowerment Hub',
};

export default async function UsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">User Management</h1>
        <p className="text-slate-500 mt-1">Manage administrator, editor, and viewer access.</p>
      </div>
      <UserList initialUsers={users} />
    </div>
  );
}