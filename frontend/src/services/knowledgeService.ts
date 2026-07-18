import api from './api'
import type { Document, DocumentListResponse } from '../types/knowledge'

export async function getDocuments(
  page = 1,
  pageSize = 20,
): Promise<DocumentListResponse> {
  const { data } = await api.get('/knowledge/documents', {
    params: { page, pageSize },
  })
  return data
}

export async function uploadDocument(
  file: File,
  category?: string,
): Promise<Document> {
  const formData = new FormData()
  formData.append('file', file)
  if (category) formData.append('category', category)

  const { data } = await api.post('/knowledge/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteDocument(id: string): Promise<void> {
  await api.delete(`/knowledge/documents/${id}`)
}

export async function seedKnowledgeBase(): Promise<{
  total: number
  indexed: number
}> {
  const { data } = await api.post('/knowledge/seed')
  return data
}
