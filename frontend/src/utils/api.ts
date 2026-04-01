import axios from 'axios'
import type {
  Category,
  CategoryPayload,
  Resource,
  ResourcePayload,
  SubjectDetail,
  SubjectPayload,
  SubjectSummary,
} from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api',
})

export const subjectApi = {
  getAll: async () => {
    const { data } = await api.get<SubjectSummary[]>('/subjects')
    return data
  },
  getById: async (id: string) => {
    const { data } = await api.get<SubjectDetail>(`/subjects/${id}`)
    return data
  },
  create: async (payload: SubjectPayload) => {
    const { data } = await api.post<SubjectDetail>('/subjects', payload)
    return data
  },
  update: async (id: string, payload: SubjectPayload) => {
    const { data } = await api.put<SubjectDetail>(`/subjects/${id}`, payload)
    return data
  },
  remove: async (id: string) => {
    const { data } = await api.delete<{ message: string }>(`/subjects/${id}`)
    return data
  },
}

export const categoryApi = {
  create: async (payload: CategoryPayload) => {
    const { data } = await api.post<Category>('/categories', payload)
    return data
  },
  update: async (id: string, payload: Pick<CategoryPayload, 'title'>) => {
    const { data } = await api.put<Category>(`/categories/${id}`, payload)
    return data
  },
  remove: async (id: string) => {
    const { data } = await api.delete<{ message: string }>(`/categories/${id}`)
    return data
  },
}

export const resourceApi = {
  create: async (payload: ResourcePayload) => {
    const { data } = await api.post<Resource>('/resources', payload)
    return data
  },
  update: async (id: string, payload: Partial<ResourcePayload>) => {
    const { data } = await api.put<Resource>(`/resources/${id}`, payload)
    return data
  },
  remove: async (id: string) => {
    const { data } = await api.delete<{ message: string }>(`/resources/${id}`)
    return data
  },
}

export default api
