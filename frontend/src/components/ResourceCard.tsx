import { FiEdit2, FiExternalLink, FiStar, FiTrash2 } from 'react-icons/fi'
import type { Resource } from '../types'
import { fallbackResourceIcon, getResourceMeta, getYoutubeEmbedUrl } from '../utils/resourceHelpers'

interface ResourceCardProps {
  resource: Resource
  onEdit: (resource: Resource) => void
  onDelete: (resource: Resource) => void
  onToggleBookmark: (resource: Resource) => void
  onPreviewVideo: (resource: Resource, embedUrl: string) => void
}

function ResourceCard({
  resource,
  onEdit,
  onDelete,
  onToggleBookmark,
  onPreviewVideo,
}: ResourceCardProps) {
  const meta = getResourceMeta(resource.type)
  const Icon = meta?.icon ?? fallbackResourceIcon

  const handlePrimaryAction = () => {
    if (resource.type === 'youtube') {
      const embedUrl = getYoutubeEmbedUrl(resource.url)
      if (embedUrl) {
        onPreviewVideo(resource, embedUrl)
        return
      }
    }

    window.open(resource.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <article className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/45 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`rounded-2xl p-3 ${meta.badgeClassName}`}>
            <Icon size={18} />
          </div>
          <div>
            <div className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              {resource.title}
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              {meta.label}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleBookmark(resource)}
          className={`rounded-full border p-2 transition ${
            resource.isBookmarked
              ? 'border-amber-400/40 bg-amber-400/15 text-amber-500'
              : 'border-slate-200 text-slate-400 hover:border-slate-300 hover:text-amber-500 dark:border-slate-700 dark:text-slate-300'
          }`}
          aria-label="Toggle bookmark"
        >
          <FiStar size={16} className={resource.isBookmarked ? 'fill-current' : ''} />
        </button>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {resource.url}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handlePrimaryAction}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-emerald-400 dark:text-slate-950 dark:hover:bg-emerald-300"
        >
          <FiExternalLink size={14} />
          {resource.type === 'youtube' ? 'Open video' : 'Visit resource'}
        </button>
        <button
          type="button"
          onClick={() => onEdit(resource)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-700 dark:text-slate-200"
        >
          <FiEdit2 size={14} />
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(resource)}
          className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/25 dark:text-red-300 dark:hover:bg-red-500/10"
        >
          <FiTrash2 size={14} />
          Delete
        </button>
      </div>
    </article>
  )
}

export default ResourceCard
