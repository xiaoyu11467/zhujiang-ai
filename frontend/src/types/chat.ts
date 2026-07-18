export interface Conversation {
  id: string
  sessionId: string
  title: string
  messageCount: number
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  conversationId: string
  role: 'user' | 'assistant' | 'system'
  content: string
  tokenCount?: number
  createdAt: string
}

export interface Feedback {
  id: string
  messageId: string
  rating: 'like' | 'dislike'
  reason?: string
}

export interface StreamChunk {
  type: 'meta' | 'content' | 'error'
  content?: string
  conversationId?: string
}
