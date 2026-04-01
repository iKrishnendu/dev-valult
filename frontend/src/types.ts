export type ResourceType = 'youtube' | 'article' | 'docs' | 'course'

export interface Resource {
  _id: string
  title: string
  url: string
  type: ResourceType
  categoryId: string
  isBookmarked: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  _id: string
  title: string
  subjectId: string
  resources: Resource[]
  createdAt: string
  updatedAt: string
}

export interface SubjectStats {
  categoryCount: number
  resourceCount: number
  bookmarkCount: number
}

export interface SubjectSummary {
  _id: string
  name: string
  createdAt: string
  updatedAt: string
  stats: SubjectStats
}

export interface SubjectDetail extends SubjectSummary {
  categories: Category[]
}

export interface SubjectPayload {
  name: string
}

export interface CategoryPayload {
  title: string
  subjectId: string
}

export interface ResourcePayload {
  title: string
  url: string
  type: ResourceType
  categoryId: string
  isBookmarked: boolean
}
