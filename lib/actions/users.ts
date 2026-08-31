'use server';

import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, ne } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requireRole } from '@/lib/auth';
import { createAuditLog, AUDIT_ACTIONS } from './audit';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { ROLES, type Role } from '@/lib/auth/roles';
import { z } from 'zod';

const createUserSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1, 'Name is required').max(100),
  role: z.enum(['super_admin', 'content_admin', 'viewer']).default('viewer'),
});

export async function createAdminUser(formData: FormData) {
  const currentUser = await requireRole(ROLES.SUPER_ADMIN as Role);

  const raw = Object.fromEntries(formData);
  const parsed = createUserSchema.safeParse(raw);

  if (!parsed.success) {
    return { success: false, error: parsed.error.flatten().fieldErrors };
  }

  const { email, password, name, role } = parsed.data;

  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    return { success: false, error: `Failed to create user: ${authError.message}` };
  }

  // Create user record in our database
  const [user] = await db.insert(users).values({
    id: authData.user.id,
    email,
    name,
    role,
    status: 'active',
  }).returning();

  await createAuditLog({
    userId: currentUser.id,
    action: AUDIT_ACTIONS.USER_CREATED,
    entityType: 'user',
    entityId: user.id,
    metadata: { email, role },
  });

  revalidatePath('/admin/users');
  return { success: true, data: user };
}

export async function updateUserRole(userId: string, newRole: Role) {
  const currentUser = await requireRole(ROLES.SUPER_ADMIN as Role);

  // Prevent self-demotion
  if (currentUser.id === userId) {
    return { success: false, error: 'You cannot change your own role' };
  }

  const [updated] = await db
    .update(users)
    .set({ role: newRole, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();

  await createAuditLog({
    userId: currentUser.id,
    action: AUDIT_ACTIONS.USER_ROLE_CHANGED,
    entityType: 'user',
    entityId: userId,
    metadata: { newRole, email: updated?.email },
  });

  revalidatePath('/admin/users');
  return { success: true, data: updated };
}

export async function deactivateUser(userId: string) {
  const currentUser = await requireRole(ROLES.SUPER_ADMIN as Role);

  if (currentUser.id === userId) {
    return { success: false, error: 'You cannot deactivate your own account' };
  }

  const [updated] = await db
    .update(users)
    .set({ status: 'inactive', updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning();

  await createAuditLog({
    userId: currentUser.id,
    action: AUDIT_ACTIONS.USER_DEACTIVATED,
    entityType: 'user',
    entityId: userId,
    metadata: { email: updated?.email },
  });

  revalidatePath('/admin/users');
  return { success: true };
}

export async function getAdminUsers() {
  await requireRole(ROLES.SUPER_ADMIN as Role);
  return db
    .select()
    .from(users)
    .where(ne(users.status, 'suspended'))
    .orderBy(users.createdAt);
}
