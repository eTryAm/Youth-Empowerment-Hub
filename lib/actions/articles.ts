'use server';

import { db } from '@/lib/db';
import { articles, articleCategories } from '@/lib/db/schema';
import { eq, desc, asc, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { createAuditLog, AUDIT_ACTIONS } from './audit';
import { z } from 'zod';

// ── Validation Schemas ──────────────────────────────────────────────────────

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(120)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only'),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
  displayOrder: z.number().int().default(0),
  status: z.enum(['draft', 'published', 'archived']).default('published'),
});

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(300),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(320)
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers and hyphens only'),
  excerpt: z.string().max(600).optional().nullable(),
  content: z.string().optional().nullable(),
  contentFormat: z.enum(['html', 'tiptap']).default('html'),
  categoryId: z.string().uuid().optional().nullable(),
  featuredImageUrl: z.string().url().optional().nullable().or(z.literal('')),
  featuredImageAlt: z.string().max(200).optional().nullable(),
  author: z.string().max(150).default('YEH Editorial Team'),
  seoTitle: z.string().max(80).optional().nullable(),
  seoDescription: z.string().max(200).optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  featured: z.boolean().default(false),
  readingTimeMinutes: z.number().int().min(1).max(120).optional().nullable(),
});

// ── Article Categories ───────────────────────────────────────────────────────

export async function getAdminArticleCategories() {
  const user = await requirePermission('articles.view');
  void user;
  try {
    return await db.select().from(articleCategories).orderBy(asc(articleCategories.displayOrder));
  } catch (error) {
    console.error('[getAdminArticleCategories]', error);
    return [];
  }
}

export async function createArticleCategory(data: unknown) {
  const user = await requirePermission('articles.edit');
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' };
  }
  try {
    const [created] = await db.insert(articleCategories).values(parsed.data).returning();
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.ARTICLE_CATEGORY_CREATED,
      entityType: 'article_category',
      metadata: { name: parsed.data.name },
    });
    revalidatePath('/admin/articles');
    revalidatePath('/learn', 'layout');
    return { success: true, data: created };
  } catch (error: any) {
    if (error?.code === '23505') return { success: false, error: 'A category with this slug already exists.' };
    console.error('[createArticleCategory]', error);
    return { success: false, error: 'Failed to create category.' };
  }
}

export async function updateArticleCategory(id: string, data: unknown) {
  const user = await requirePermission('articles.edit');
  const parsed = categorySchema.partial().safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' };
  }
  try {
    const [updated] = await db
      .update(articleCategories)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(articleCategories.id, id))
      .returning();
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.ARTICLE_CATEGORY_UPDATED,
      entityType: 'article_category',
      entityId: id,
      metadata: parsed.data,
    });
    revalidatePath('/admin/articles');
    revalidatePath('/learn', 'layout');
    return { success: true, data: updated };
  } catch (error: any) {
    if (error?.code === '23505') return { success: false, error: 'A category with this slug already exists.' };
    console.error('[updateArticleCategory]', error);
    return { success: false, error: 'Failed to update category.' };
  }
}

export async function deleteArticleCategory(id: string) {
  const user = await requirePermission('articles.delete');
  try {
    await db.delete(articleCategories).where(eq(articleCategories.id, id));
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.ARTICLE_CATEGORY_DELETED,
      entityType: 'article_category',
      entityId: id,
    });
    revalidatePath('/admin/articles');
    revalidatePath('/learn', 'layout');
    return { success: true };
  } catch (error) {
    console.error('[deleteArticleCategory]', error);
    return { success: false, error: 'Failed to delete category.' };
  }
}

// ── Articles ─────────────────────────────────────────────────────────────────

export async function getAdminArticles() {
  const user = await requirePermission('articles.view');
  void user;
  try {
    return await db
      .select({
        id: articles.id,
        title: articles.title,
        slug: articles.slug,
        status: articles.status,
        featured: articles.featured,
        author: articles.author,
        publishedAt: articles.publishedAt,
        createdAt: articles.createdAt,
        updatedAt: articles.updatedAt,
        categoryId: articles.categoryId,
        categoryName: articleCategories.name,
      })
      .from(articles)
      .leftJoin(articleCategories, eq(articles.categoryId, articleCategories.id))
      .orderBy(desc(articles.updatedAt));
  } catch (error) {
    console.error('[getAdminArticles]', error);
    return [];
  }
}

export async function getAdminArticleById(id: string) {
  const user = await requirePermission('articles.view');
  void user;
  try {
    const [article] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    return article ?? null;
  } catch (error) {
    console.error('[getAdminArticleById]', error);
    return null;
  }
}

export async function createArticle(data: unknown) {
  const user = await requirePermission('articles.edit');
  const parsed = articleSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' };
  }
  try {
    const isPublished = parsed.data.status === 'published';
    const [created] = await db
      .insert(articles)
      .values({
        ...parsed.data,
        featuredImageUrl: parsed.data.featuredImageUrl || null,
        authorId: user.id,
        publishedAt: isPublished ? new Date() : null,
      })
      .returning();
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.ARTICLE_CREATED,
      entityType: 'article',
      metadata: { title: parsed.data.title, slug: parsed.data.slug, status: parsed.data.status },
    });
    revalidatePath('/admin/articles');
    if (isPublished) {
      revalidatePath('/learn', 'layout');
      revalidatePath(`/learn/${parsed.data.slug}`);
    }
    return { success: true, data: created };
  } catch (error: any) {
    if (error?.code === '23505') return { success: false, error: 'An article with this slug already exists.' };
    console.error('[createArticle]', error);
    return { success: false, error: 'Failed to create article.' };
  }
}

export async function updateArticle(id: string, data: unknown) {
  const user = await requirePermission('articles.edit');
  const parsed = articleSchema.partial().safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' };
  }

  const [current] = await db
    .select({ status: articles.status, publishedAt: articles.publishedAt, slug: articles.slug })
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);
  if (!current) return { success: false, error: 'Article not found.' };

  const isBeingPublished = parsed.data.status === 'published' && current.status !== 'published';
  const publishedAt = isBeingPublished ? new Date() : current.publishedAt;

  try {
    const [updated] = await db
      .update(articles)
      .set({
        ...parsed.data,
        featuredImageUrl: parsed.data.featuredImageUrl === '' ? null : parsed.data.featuredImageUrl,
        publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id))
      .returning();

    const action = isBeingPublished ? AUDIT_ACTIONS.ARTICLE_PUBLISHED : AUDIT_ACTIONS.ARTICLE_UPDATED;
    await createAuditLog({
      userId: user.id,
      action,
      entityType: 'article',
      entityId: id,
      metadata: { changes: Object.keys(parsed.data) },
    });

    revalidatePath('/admin/articles');
    revalidatePath(`/admin/articles/${id}`);
    revalidatePath('/learn', 'layout');
    revalidatePath(`/learn/${current.slug}`);
    if (parsed.data.slug && parsed.data.slug !== current.slug) {
      revalidatePath(`/learn/${parsed.data.slug}`);
    }
    return { success: true, data: updated };
  } catch (error: any) {
    if (error?.code === '23505') return { success: false, error: 'An article with this slug already exists.' };
    console.error('[updateArticle]', error);
    return { success: false, error: 'Failed to update article.' };
  }
}

export async function deleteArticle(id: string) {
  const user = await requirePermission('articles.delete');
  try {
    const [deleted] = await db.delete(articles).where(eq(articles.id, id)).returning({ slug: articles.slug });
    await createAuditLog({
      userId: user.id,
      action: AUDIT_ACTIONS.ARTICLE_DELETED,
      entityType: 'article',
      entityId: id,
    });
    revalidatePath('/admin/articles');
    revalidatePath('/learn', 'layout');
    if (deleted?.slug) revalidatePath(`/learn/${deleted.slug}`);
    return { success: true };
  } catch (error) {
    console.error('[deleteArticle]', error);
    return { success: false, error: 'Failed to delete article.' };
  }
}

export async function publishArticle(id: string) {
  return updateArticle(id, { status: 'published' });
}

export async function unpublishArticle(id: string) {
  return updateArticle(id, { status: 'draft' });
}
