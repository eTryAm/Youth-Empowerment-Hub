'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Check, X, GripVertical } from 'lucide-react';
import {
  createArticleCategory,
  updateArticleCategory,
  deleteArticleCategory,
} from '@/lib/actions/articles';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  displayOrder: number | null;
}

interface CategoryManagerProps {
  categories: Category[];
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 120);
}

interface InlineFormState {
  name: string;
  slug: string;
  description: string;
  slugTouched: boolean;
}

function emptyForm(): InlineFormState {
  return { name: '', slug: '', description: '', slugTouched: false };
}

export function CategoryManager({ categories: initialCategories }: CategoryManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [categories, setCategories] = useState(initialCategories);

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState<InlineFormState>(emptyForm());

  // Edit form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<InlineFormState>(emptyForm());

  // Delete confirm
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // ── Add ──────────────────────────────────────────────────────────────────────

  function handleAddNameChange(value: string) {
    setAddForm((prev) => ({
      ...prev,
      name: value,
      slug: prev.slugTouched ? prev.slug : slugify(value),
    }));
  }

  function handleAddSlugChange(value: string) {
    setAddForm((prev) => ({
      ...prev,
      slug: value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
      slugTouched: true,
    }));
  }

  function handleAdd() {
    if (!addForm.name.trim() || !addForm.slug.trim()) {
      toast.error('Name and slug are required.');
      return;
    }
    startTransition(async () => {
      const result = await createArticleCategory({
        name: addForm.name.trim(),
        slug: addForm.slug.trim(),
        description: addForm.description.trim() || undefined,
        displayOrder: categories.length,
        status: 'published',
      });
      if (result.success && result.data) {
        toast.success('Category created.');
        setCategories((prev) => [
          ...prev,
          {
            id: result.data!.id,
            name: result.data!.name,
            slug: result.data!.slug,
            description: result.data!.description ?? null,
            displayOrder: result.data!.displayOrder ?? null,
          },
        ]);
        setAddForm(emptyForm());
        setShowAdd(false);
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to create category.');
      }
    });
  }

  // ── Edit ─────────────────────────────────────────────────────────────────────

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditForm({ name: cat.name, slug: cat.slug, description: cat.description ?? '', slugTouched: true });
    setShowAdd(false);
  }

  function handleEditNameChange(value: string) {
    setEditForm((prev) => ({
      ...prev,
      name: value,
    }));
  }

  function handleEditSlugChange(value: string) {
    setEditForm((prev) => ({
      ...prev,
      slug: value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
    }));
  }

  function handleEditSave(id: string) {
    if (!editForm.name.trim() || !editForm.slug.trim()) {
      toast.error('Name and slug are required.');
      return;
    }
    startTransition(async () => {
      const result = await updateArticleCategory(id, {
        name: editForm.name.trim(),
        slug: editForm.slug.trim(),
        description: editForm.description.trim() || undefined,
      });
      if (result.success) {
        toast.success('Category updated.');
        setCategories((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, name: editForm.name, slug: editForm.slug, description: editForm.description || null }
              : c,
          ),
        );
        setEditingId(null);
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to update category.');
      }
    });
  }

  // ── Delete ───────────────────────────────────────────────────────────────────

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteArticleCategory(id);
      if (result.success) {
        toast.success('Category deleted.');
        setCategories((prev) => prev.filter((c) => c.id !== id));
        setConfirmDelete(null);
        router.refresh();
      } else {
        toast.error(result.error ?? 'Failed to delete category.');
      }
    });
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-base font-bold text-slate-900 mb-2">Delete Category?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Articles in this category will not be deleted, but they will lose their category
              assignment. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={isPending}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors"
              >
                {isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Article Categories</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Organise articles into categories. Categories appear in the public Knowledge &amp; Updates section.
          </p>
        </div>
        <button
          onClick={() => { setShowAdd(true); setEditingId(null); }}
          disabled={showAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <Plus size={15} />
          New Category
        </button>
      </div>

      {/* Add inline form */}
      {showAdd && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-blue-900">New Category</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={addForm.name}
                onChange={(e) => handleAddNameChange(e.target.value)}
                maxLength={100}
                placeholder="e.g. Career &amp; Opportunities"
                autoFocus
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={addForm.slug}
                onChange={(e) => handleAddSlugChange(e.target.value)}
                maxLength={120}
                placeholder="career-opportunities"
                pattern="^[a-z0-9-]+"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-400 mt-1">URL: /learn/category/{addForm.slug || '…'}</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Description (optional)</label>
            <input
              type="text"
              value={addForm.description}
              onChange={(e) => setAddForm((prev) => ({ ...prev, description: e.target.value }))}
              maxLength={500}
              placeholder="Short description shown on the category page"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => { setShowAdd(false); setAddForm(emptyForm()); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={isPending || !addForm.name.trim() || !addForm.slug.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              <Check size={14} /> {isPending ? 'Creating…' : 'Create Category'}
            </button>
          </div>
        </div>
      )}

      {/* Category list */}
      {categories.length === 0 && !showAdd ? (
        <div className="bg-white rounded-xl border border-slate-200 p-14 text-center">
          <p className="text-sm text-slate-500 mb-3">No categories yet.</p>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Plus size={15} /> Create First Category
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider w-6" />
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Description</th>
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) =>
                editingId === cat.id ? (
                  // Inline edit row
                  <tr key={cat.id} className="bg-blue-50/60">
                    <td className="px-5 py-3 text-slate-300">
                      <GripVertical size={15} />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => handleEditNameChange(e.target.value)}
                        maxLength={100}
                        autoFocus
                        className="w-full border border-blue-300 rounded-lg px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <input
                        type="text"
                        value={editForm.slug}
                        onChange={(e) => handleEditSlugChange(e.target.value)}
                        maxLength={120}
                        className="w-full border border-blue-300 rounded-lg px-2.5 py-1.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                        maxLength={500}
                        placeholder="Optional description"
                        className="w-full border border-blue-300 rounded-lg px-2.5 py-1.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => handleEditSave(cat.id)}
                          disabled={isPending}
                          title="Save"
                          className="p-2 rounded-lg text-green-600 hover:bg-green-50 disabled:opacity-50 transition-colors"
                        >
                          <Check size={15} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          title="Cancel"
                          className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Normal row
                  <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 text-slate-300">
                      <GripVertical size={15} />
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-900">{cat.name}</td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <code className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                        {cat.slug}
                      </code>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-slate-500 text-xs">
                      {cat.description ?? <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 justify-end">
                        <button
                          onClick={() => startEdit(cat)}
                          title="Edit"
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(cat.id)}
                          title="Delete"
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-400">
        Category slugs must be unique. Deleting a category does not delete its articles — they will
        appear without a category.
      </p>
    </div>
  );
}
