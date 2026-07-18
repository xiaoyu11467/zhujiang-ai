import api from './api'
import type { Conversation, Message, StreamChunk } from '../types/chat'

/**
 * 发送消息（SSE流式）
 */
export async function* sendMessageStream(
  question: string,
  sessionId: string,
  conversationId?: string,
): AsyncGenerator<StreamChunk> {
  const response = await fetch('/api/chat/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, sessionId, conversationId }),
  })

  if (!response.ok) {
    throw new Error('发送消息失败')
  }

  const reader = response.body?.getReader()
  if (!reader) throw new Error('无法读取响应流')

  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed || !trimmed.startsWith('data: ')) continue

      const data = trimmed.slice(6)
      if (data === '[DONE]') return

      try {
        const chunk: StreamChunk = JSON.parse(data)
        yield chunk
      } catch {
        // skip malformed lines
      }
    }
  }
}

/**
 * 获取历史对话列表
 */
export async function getConversations(sessionId: string): Promise<Conversation[]> {
  const { data } = await api.get('/chat/conversations', {
    params: { sessionId },
  })
  return data
}

/**
 * 获取对话消息
 */
export async function getMessages(conversationId: string): Promise<Message[]> {
  const { data } = await api.get(`/chat/conversations/${conversationId}`)
  return data
}

/**
 * 删除对话
 */
export async function deleteConversation(id: string): Promise<void> {
  await api.delete(`/chat/conversations/${id}`)
}

/**
 * 提交反馈
 */
export async function submitFeedback(
  messageId: string,
  rating: 'like' | 'dislike',
  reason?: string,
): Promise<void> {
  await api.post('/chat/feedback', { messageId, rating, reason })
}
