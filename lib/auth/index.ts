import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { hasPermission, type Role, type Permission } from './roles';

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  avatarUrl: string | null;
  status: string | null;
};

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return user;
}

export async function getUser(): Promise<AuthUser | null> {
  const sessionUser = await getSession();
  if (!sessionUser) return null;

  const [dbUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, sessionUser.id))
    .limit(1);

  if (!dbUser) return null;

  return {
    id: dbUser.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role as Role,
    avatarUrl: dbUser.avatarUrl,
    status: dbUser.status,
  };
}

export async function signOutAndRedirect(path: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(path);
}

export async function requireAuth(): Promise<AuthUser> {
  const sessionUser = await getSession();
  if (!sessionUser) {
    redirect('/login');
  }

  const user = await getUser();
  if (!user) {
    await signOutAndRedirect('/login?error=no_account');
    throw new Error('User not found');
  }
  if (user.status === 'inactive' || user.status === 'suspended') {
    await signOutAndRedirect('/login?error=account_disabled');
    throw new Error('Account disabled');
  }
  return user;
}

export async function requirePermission(permission: Permission): Promise<AuthUser> {
  const user = await requireAuth();
  if (!hasPermission(user.role, permission)) {
    redirect('/admin?error=unauthorized');
  }
  return user;
}

export async function requireRole(requiredRole: Role): Promise<AuthUser> {
  const user = await requireAuth();
  const roleHierarchy: Record<Role, number> = {
    super_admin: 3,
    content_admin: 2,
    viewer: 1,
  };
  if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
    redirect('/admin?error=unauthorized');
  }
  return user;
}
