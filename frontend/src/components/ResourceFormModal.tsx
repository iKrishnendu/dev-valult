import { useState, type FormEvent } from 'react'
import Modal from './Modal'
import type { Resource, ResourceType } from '../types'

interface ResourceFormModalProps {
  categories: Array<{ _id: string; title: string }>
  resource?: Resource
  defaultCategoryId?: string
  onClose: () => void
  onSubmit: (payload: {
    title: string
    url: string
    type: ResourceType
    categoryId: string
    isBookmarked: boolean
  }) => Promise<void>
}

function ResourceFormModal({
  categories,
  resource,
  defaultCategoryId,
  onClose,
  onSubmit,
}: ResourceFormModalProps) {
  const [form, setForm] = useState({
    title: resource?.title ?? '',
    url: resource?.url ?? '',
    type: resource?.type ?? ('docs' as ResourceType),
    categoryId: resource?.categoryId ?? defaultCategoryId ?? categories[0]?._id ?? '',
    isBookmarked: resource?.isBookmarked ?? false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.title.trim() || !form.url.trim() || !form.categoryId) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        title: form.title.trim(),
        url: form.url.trim(),
        type: form.type,
        categoryId: form.categoryId,
        isBookmarked: form.isBookmarked,
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      title={resource ? 'Edit resource' : 'Add resource'}
      description="Save learning links from YouTube, official docs, articles, and courses."
      onClose={onClose}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            Resource title
          </span>
          <input
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="React official docs"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:focus:border-emerald-400"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            URL
          </span>
          <input
            value={form.url}
            onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
            placeholder="https://react.dev"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:focus:border-emerald-400"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Type
            </span>
            <select
              value={form.type}
              onChange={(event) =>
                setForm((current) => ({ ...current, type: event.target.value as ResourceType }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:focus:border-emerald-400"
            >
              <option value="docs">Docs</option>
              <option value="article">Article</option>
              <option value="youtube">YouTube</option>
              <option value="course">Course</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
              Category
            </span>
            <select
              value={form.categoryId}
              onChange={(event) =>
                setForm((current) => ({ ...current, categoryId: event.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white dark:border-slate-700 dark:bg-slate-950/60 dark:text-white dark:focus:border-emerald-400"
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-950/60">
          <input
            type="checkbox"
            checked={form.isBookmarked}
            onChange={(event) =>
              setForm((current) => ({ ...current, isBookmarked: event.target.checked }))
            }
            className="size-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-400"
          />
          <span className="text-sm text-slate-700 dark:text-slate-200">Bookmark this resource</span>
        </label>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
          >
            {isSubmitting ? 'Saving...' : resource ? 'Save changes' : 'Create resource'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default ResourceFormModal
