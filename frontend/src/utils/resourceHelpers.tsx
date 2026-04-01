import {
  FiBook,
  FiFileText,
  FiGlobe,
  FiPlayCircle,
  FiYoutube,
} from 'react-icons/fi'
import type { IconType } from 'react-icons'
import type { ResourceType } from '../types'

interface ResourceMeta {
  icon: IconType
  badgeClassName: string
  label: string
}

const resourceMetaMap: Record<ResourceType, ResourceMeta> = {
  youtube: {
    icon: FiYoutube,
    badgeClassName:
      'bg-red-500/15 text-red-600 ring-1 ring-inset ring-red-500/25 dark:text-red-300',
    label: 'YouTube',
  },
  docs: {
    icon: FiBook,
    badgeClassName:
      'bg-emerald-500/15 text-emerald-700 ring-1 ring-inset ring-emerald-500/25 dark:text-emerald-300',
    label: 'Docs',
  },
  article: {
    icon: FiGlobe,
    badgeClassName:
      'bg-sky-500/15 text-sky-700 ring-1 ring-inset ring-sky-500/25 dark:text-sky-300',
    label: 'Article',
  },
  course: {
    icon: FiPlayCircle,
    badgeClassName:
      'bg-amber-500/15 text-amber-700 ring-1 ring-inset ring-amber-500/25 dark:text-amber-300',
    label: 'Course',
  },
}

export const getResourceMeta = (type: ResourceType) => resourceMetaMap[type]

export const fallbackResourceIcon = FiFileText

export const getYoutubeEmbedUrl = (url: string) => {
  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
  } catch {
    return null
  }

  return null
}
