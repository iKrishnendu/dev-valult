import { create } from 'zustand'
import { categoryApi, resourceApi, subjectApi } from '../utils/api'
import type {
  CategoryPayload,
  Resource,
  ResourcePayload,
  SubjectDetail,
  SubjectPayload,
  SubjectSummary,
} from '../types'

interface DevVaultState {
  subjects: SubjectSummary[]
  activeSubjectId: string | null
  activeSubject: SubjectDetail | null
  isLoading: boolean
  isMutating: boolean
  error: string | null
  initialize: () => Promise<void>
  fetchSubjects: () => Promise<SubjectSummary[]>
  selectSubject: (id: string) => Promise<void>
  createSubject: (payload: SubjectPayload) => Promise<void>
  updateSubject: (id: string, payload: SubjectPayload) => Promise<void>
  deleteSubject: (id: string) => Promise<void>
  createCategory: (payload: CategoryPayload) => Promise<void>
  updateCategory: (id: string, title: string) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  createResource: (payload: ResourcePayload) => Promise<void>
  updateResource: (id: string, payload: Partial<ResourcePayload>) => Promise<void>
  deleteResource: (id: string) => Promise<void>
  toggleBookmark: (resource: Resource) => Promise<void>
  clearError: () => void
}

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message
  }

  return error instanceof Error ? error.message : fallback
}

const refreshSubjectState = async (
  activeSubjectId: string | null,
  set: (partial: Partial<DevVaultState>) => void,
) => {
  const subjects = await subjectApi.getAll()

  if (!subjects.length) {
    set({
      subjects: [],
      activeSubject: null,
      activeSubjectId: null,
    })
    return
  }

  const nextActiveId =
    activeSubjectId && subjects.some((subject) => subject._id === activeSubjectId)
      ? activeSubjectId
      : subjects[0]._id

  const activeSubject = await subjectApi.getById(nextActiveId)

  set({
    subjects,
    activeSubjectId: nextActiveId,
    activeSubject,
  })
}

export const useDevVaultStore = create<DevVaultState>((set, get) => ({
  subjects: [],
  activeSubjectId: null,
  activeSubject: null,
  isLoading: false,
  isMutating: false,
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null })

    try {
      await refreshSubjectState(get().activeSubjectId, set)
    } catch (error) {
      set({ error: getErrorMessage(error, 'Failed to load subjects.') })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchSubjects: async () => {
    const subjects = await subjectApi.getAll()
    set({ subjects })
    return subjects
  },

  selectSubject: async (id) => {
    set({ isLoading: true, error: null })

    try {
      const activeSubject = await subjectApi.getById(id)
      set({ activeSubjectId: id, activeSubject })
    } catch (error) {
      set({ error: getErrorMessage(error, 'Failed to load subject details.') })
    } finally {
      set({ isLoading: false })
    }
  },

  createSubject: async (payload) => {
    set({ isMutating: true, error: null })

    try {
      const subject = await subjectApi.create(payload)
      await refreshSubjectState(subject._id, set)
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to create subject.')
      set({ error: message })
      throw error
    } finally {
      set({ isMutating: false })
    }
  },

  updateSubject: async (id, payload) => {
    set({ isMutating: true, error: null })

    try {
      await subjectApi.update(id, payload)
      await refreshSubjectState(id, set)
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to update subject.')
      set({ error: message })
      throw error
    } finally {
      set({ isMutating: false })
    }
  },

  deleteSubject: async (id) => {
    set({ isMutating: true, error: null })

    try {
      await subjectApi.remove(id)
      const remainingSubjects = get().subjects.filter((subject) => subject._id !== id)
      const fallbackSubjectId = remainingSubjects[0]?._id ?? null
      await refreshSubjectState(fallbackSubjectId, set)
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to delete subject.')
      set({ error: message })
      throw error
    } finally {
      set({ isMutating: false })
    }
  },

  createCategory: async (payload) => {
    set({ isMutating: true, error: null })

    try {
      await categoryApi.create(payload)
      await refreshSubjectState(payload.subjectId, set)
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to create category.')
      set({ error: message })
      throw error
    } finally {
      set({ isMutating: false })
    }
  },

  updateCategory: async (id, title) => {
    set({ isMutating: true, error: null })

    try {
      await categoryApi.update(id, { title })
      await refreshSubjectState(get().activeSubjectId, set)
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to update category.')
      set({ error: message })
      throw error
    } finally {
      set({ isMutating: false })
    }
  },

  deleteCategory: async (id) => {
    set({ isMutating: true, error: null })

    try {
      await categoryApi.remove(id)
      await refreshSubjectState(get().activeSubjectId, set)
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to delete category.')
      set({ error: message })
      throw error
    } finally {
      set({ isMutating: false })
    }
  },

  createResource: async (payload) => {
    set({ isMutating: true, error: null })

    try {
      await resourceApi.create(payload)
      await refreshSubjectState(get().activeSubjectId, set)
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to create resource.')
      set({ error: message })
      throw error
    } finally {
      set({ isMutating: false })
    }
  },

  updateResource: async (id, payload) => {
    set({ isMutating: true, error: null })

    try {
      await resourceApi.update(id, payload)
      await refreshSubjectState(get().activeSubjectId, set)
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to update resource.')
      set({ error: message })
      throw error
    } finally {
      set({ isMutating: false })
    }
  },

  deleteResource: async (id) => {
    set({ isMutating: true, error: null })

    try {
      await resourceApi.remove(id)
      await refreshSubjectState(get().activeSubjectId, set)
    } catch (error) {
      const message = getErrorMessage(error, 'Failed to delete resource.')
      set({ error: message })
      throw error
    } finally {
      set({ isMutating: false })
    }
  },

  toggleBookmark: async (resource) => {
    await get().updateResource(resource._id, {
      isBookmarked: !resource.isBookmarked,
    })
  },

  clearError: () => set({ error: null }),
}))
