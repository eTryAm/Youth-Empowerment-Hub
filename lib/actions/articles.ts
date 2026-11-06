'use server';

import { db } from '@/lib/db';
import { articles, articleCategories } from '@/lib/db/schema';
import { eq, desc, asc, and, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { requirePermission } from '@/lib/auth';
import { createAuditLog, AUDIT_ACTIONS } from './audit';
import { cleanImageUrl } from '@/lib/image-url';
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
  status: z.enum(['draft', 'pending_review', 'published', 'archived', 'rejected']).default('draft'),
  featured: z.boolean().default(false),
  readingTimeMinutes: z.number().int().min(1).max(120).optional().nullable(),
});

// Public submission schema — no auth required
const submissionSchema = z.object({
  title: z.string().min(3, 'Title is required').max(200),
  submittedByName: z.string().min(1, 'Your name is required').max(100),
  submittedByEmail: z.string().email('A valid email is required'),
  excerpt: z.string().max(400).optional(),
  contentPlaintext: z.string().min(80, 'Article must be at least 80 characters').max(50000),
  categoryId: z.string().uuid().optional().nullable().or(z.literal('other')).or(z.literal('')),
  customCategoryName: z.string().max(100).optional().nullable(),
});

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 280);
}

/** Convert plain text (double-newline paragraphs) to sanitized HTML */
function plaintextToHtml(text: string): string {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
  return paragraphs.map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`).join('\n');
}

function revalidateArticlePaths(slug?: string | null) {
  try {
    revalidatePath('/admin/articles');
    revalidatePath('/learn');
    revalidatePath('/learn', 'layout');
    revalidatePath('/learn', 'page');
    revalidatePath('/');
    if (slug) {
      revalidatePath(`/learn/${slug}`);
      revalidatePath(`/learn/${slug}`, 'page');
    }
  } catch (e) {
    console.error('[revalidateArticlePaths]', e);
  }
}

function estimateReadingTime(text: string): number {
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(wordCount / 200));
}

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
  const user = await requirePermission('articles.create');
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
        submittedByName: articles.submittedByName,
        submittedByEmail: articles.submittedByEmail,
        submittedAt: articles.submittedAt,
        reviewNote: articles.reviewNote,
        viewCount: articles.viewCount,
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
  const user = await requirePermission('articles.create');
  const parsed = articleSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' };
  }
  try {
    const isPublished = parsed.data.status === 'published';
    if (isPublished) {
      await requirePermission('articles.publish');
    }

    const content = parsed.data.content
      ? parsed.data.content.includes('<p') || parsed.data.content.includes('<div') || parsed.data.content.includes('<h')
        ? parsed.data.content
        : plaintextToHtml(parsed.data.content)
      : null;

    const [created] = await db
      .insert(articles)
      .values({
        ...parsed.data,
        content,
        featuredImageUrl: cleanImageUrl(parsed.data.featuredImageUrl),
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
    revalidateArticlePaths(parsed.data.slug);
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

  if (parsed.data.status && parsed.data.status !== current.status) {
    await requirePermission('articles.publish');
  }

  const isBeingPublished = parsed.data.status === 'published' && current.status !== 'published';
  const publishedAt = isBeingPublished ? new Date() : current.publishedAt;

  const content = parsed.data.content !== undefined
    ? parsed.data.content && (parsed.data.content.includes('<p') || parsed.data.content.includes('<div') || parsed.data.content.includes('<h'))
      ? parsed.data.content
      : parsed.data.content ? plaintextToHtml(parsed.data.content) : null
    : undefined;

  const updatePayload: Record<string, any> = {
    ...parsed.data,
    publishedAt,
    updatedAt: new Date(),
  };

  if (content !== undefined) updatePayload.content = content;
  if (parsed.data.featuredImageUrl !== undefined) {
    updatePayload.featuredImageUrl = cleanImageUrl(parsed.data.featuredImageUrl);
  }

  try {
    const [updated] = await db
      .update(articles)
      .set(updatePayload)
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

    revalidateArticlePaths(current.slug);
    if (parsed.data.slug && parsed.data.slug !== current.slug) {
      revalidateArticlePaths(parsed.data.slug);
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
    revalidateArticlePaths(deleted?.slug);
    return { success: true };
  } catch (error) {
    console.error('[deleteArticle]', error);
    return { success: false, error: 'Failed to delete article.' };
  }
}

export async function publishArticle(id: string) {
  await requirePermission('articles.publish');
  return updateArticle(id, { status: 'published' });
}

export async function unpublishArticle(id: string) {
  await requirePermission('articles.publish');
  return updateArticle(id, { status: 'draft' });
}

// ── Review workflow ───────────────────────────────────────────────────────────

export async function reviewArticle(id: string, action: 'approve' | 'reject', reviewNote?: string) {
  const user = await requirePermission('articles.publish');

  const [current] = await db
    .select({ slug: articles.slug, title: articles.title, submittedByEmail: articles.submittedByEmail })
    .from(articles)
    .where(eq(articles.id, id))
    .limit(1);
  if (!current) return { success: false, error: 'Article not found.' };

  const isApproving = action === 'approve';
  try {
    await db
      .update(articles)
      .set({
        status: isApproving ? 'published' : 'rejected',
        publishedAt: isApproving ? new Date() : null,
        reviewNote: reviewNote ?? null,
        updatedAt: new Date(),
      })
      .where(eq(articles.id, id));

    await createAuditLog({
      userId: user.id,
      action: isApproving ? AUDIT_ACTIONS.ARTICLE_APPROVED : AUDIT_ACTIONS.ARTICLE_REJECTED,
      entityType: 'article',
      entityId: id,
      metadata: { title: current.title, reviewNote },
    });

    revalidateArticlePaths(current.slug);
    return { success: true };
  } catch (error) {
    console.error('[reviewArticle]', error);
    return { success: false, error: 'Failed to update article status.' };
  }
}

// ── Public submission ─────────────────────────────────────────────────────────

export async function submitArticleForReview(data: unknown) {
  // No auth — this is a public action
  const parsed = submissionSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' };
  }

  const { title, submittedByName, submittedByEmail, excerpt, contentPlaintext, categoryId, customCategoryName } = parsed.data;

  // Resolve category if customCategoryName is provided or categoryId === 'other'
  let resolvedCategoryId: string | null = categoryId && categoryId !== 'other' ? categoryId : null;
  if (customCategoryName && customCategoryName.trim()) {
    const customName = customCategoryName.trim();
    const customSlug = slugify(customName);
    try {
      const [existingCat] = await db
        .select({ id: articleCategories.id })
        .from(articleCategories)
        .where(eq(articleCategories.slug, customSlug))
        .limit(1);

      if (existingCat) {
        resolvedCategoryId = existingCat.id;
      } else {
        const [createdCat] = await db
          .insert(articleCategories)
          .values({
            name: customName,
            slug: customSlug,
            description: `Articles in ${customName}.`,
            displayOrder: 99,
            status: 'published',
          })
          .returning({ id: articleCategories.id });
        if (createdCat) {
          resolvedCategoryId = createdCat.id;
        }
      }
    } catch (e) {
      console.error('[submitArticleForReview customCategory]', e);
    }
  }

  // Auto-generate unique slug
  const baseSlug = slugify(title);
  const suffix = Math.random().toString(36).slice(2, 7);
  const slug = `${baseSlug}-${suffix}`;

  // Convert plain text to HTML paragraphs
  const content = plaintextToHtml(contentPlaintext);

  // Auto-estimate reading time
  const readingTimeMinutes = estimateReadingTime(contentPlaintext);

  try {
    await db.insert(articles).values({
      title,
      slug,
      excerpt: excerpt || null,
      content,
      contentPlaintext,
      contentFormat: 'html',
      categoryId: resolvedCategoryId,
      author: submittedByName,
      submittedByName,
      submittedByEmail,
      submittedAt: new Date(),
      status: 'pending_review',
      readingTimeMinutes,
      featured: false,
    });

    revalidatePath('/admin/articles');
    return { success: true };
  } catch (error: any) {
    console.error('[submitArticleForReview]', error);
    return { success: false, error: 'Failed to submit article. Please try again.' };
  }
}

// ── View count ────────────────────────────────────────────────────────────────

export async function incrementArticleViewCount(slug: string) {
  // No auth — public, fire and forget
  try {
    await db
      .update(articles)
      .set({ viewCount: sql`COALESCE(${articles.viewCount}, 0) + 1` })
      .where(and(eq(articles.slug, slug), eq(articles.status, 'published')));
  } catch {
    // Non-critical — never surface to user
  }
}
