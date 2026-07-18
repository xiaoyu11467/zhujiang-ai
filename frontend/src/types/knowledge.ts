export interface Document {
  id: string
  filename: string
  originalName: string
  fileType: 'pdf' | 'docx' | 'md' | 'txt' | 'url'
  fileSize: number
  chunkCount: number
  charCount: number
  status: 'uploading' | 'parsing' | 'indexing' | 'completed' | 'failed'
  errorMessage?: string
  sourceUrl?: string
  category?: string
  createdAt: string
  updatedAt: string
}

export interface DocumentListResponse {
  documents: Document[]
  total: number
  page: number
  pageSize: number
}
