import { FiEdit2, FiFolderPlus, FiTrash2 } from 'react-icons/fi'
import type { Category, Resource } from '../types'
import EmptyState from './EmptyState'
import ResourceCard from './ResourceCard'

interface CategorySectionProps {
  category: Category
  resources: Resource[]
  onCreateResource: (categoryId: string) => void
  onEditCategory: (category: Category) => void
  onDeleteCategory: (category: Category) => void
  onEditResource: (resource: Resource) => void
  onDeleteResource: (resource: Resource) => void
  onToggleBookmark: (resource: Resource) => void
  onPreviewVideo: (resource: Resource, embedUrl: string) => void
}

function CategorySection({
  category,
  resources,
  onCreateResource,
  onEditCategory,
  onDeleteCategory,
  onEditResource,
  onDeleteResource,
  onToggleBookmark,
  onPreviewVideo,
}: CategorySectionProps) {
  return (
    <section className="glass-panel rounded-[28px] p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
            Category
          </div>
          <h3 className="mt-2 font-display text-2xl font-semibold text-slate-900 dark:text-white">
            {category.title}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            {resources.length} saved resources ready for review.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onCreateResource(category._id)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
          >
            <FiFolderPlus size={14} />
            Add resource
          </button>
          <button
            type="button"
            onClick={() => onEditCategory(category)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200"
          >
            <FiEdit2 size={14} />
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDeleteCategory(category)}
            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/25 dark:text-red-300 dark:hover:bg-red-500/10"
          >
            <FiTrash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      {resources.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {resources.map((resource) => (
            <ResourceCard
              key={resource._id}
              resource={resource}
              onEdit={onEditResource}
              onDelete={onDeleteResource}
              onToggleBookmark={onToggleBookmark}
              onPreviewVideo={onPreviewVideo}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No resources in this category"
          description="Start with a doc link, article, course, or YouTube walkthrough."
          actionLabel="Add resource"
          onAction={() => onCreateResource(category._id)}
        />
      )}
    </section>
  )
}

export default CategorySection
