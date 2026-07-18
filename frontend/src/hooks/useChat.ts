import { useCallback } from 'react'
import { useChatStore } from '../stores/chatStore'
import { sendMessageStream, getConversations, getMessages, deleteConversation } from '../services/chatService'
import type { Message } from '../types/chat'

export function useChat() {
  const store = useChatStore()

  /** 加载历史对话列表 */
  const loadConversations = useCallback(async () => {
    try {
      const conversations = await getConversations(store.sessionId)
      store.setConversations(conversations)
    } catch {
      // 静默失败
    }
  }, [store.sessionId])

  /** 加载对话消息 */
  const loadMessages = useCallback(async (conversationId: string) => {
    try {
      const messages = await getMessages(conversationId)
      store.setMessages(messages)
      store.setCurrentConversationId(conversationId)
    } catch {
      // 静默失败
    }
  }, [])

  /** 发送消息 */
  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim() || store.isStreaming) return

      // 添加用户消息
      const userMsg: Message = {
        id: `temp_${Date.now()}`,
        conversationId: store.currentConversationId || '',
        role: 'user',
        content: question,
        createdAt: new Date().toISOString(),
      }
      store.addMessage(userMsg)

      // 添加助手占位消息
      const assistantMsg: Message = {
        id: `temp_${Date.now() + 1}`,
        conversationId: store.currentConversationId || '',
        role: 'assistant',
        content: '',
        createdAt: new Date().toISOString(),
      }
      store.addMessage(assistantMsg)
      store.setIsStreaming(true)

      try {
        for await (const chunk of sendMessageStream(
          question,
          store.sessionId,
          store.currentConversationId || undefined,
        )) {
          if (chunk.type === 'meta' && chunk.conversationId) {
            store.setCurrentConversationId(chunk.conversationId)
          }
          if (chunk.type === 'content' && chunk.content) {
            store.appendContent(chunk.content)
          }
          if (chunk.type === 'error') {
            store.appendContent(chunk.content || '抱歉，出了点问题')
          }
        }
      } catch {
        store.appendContent('抱歉，网络出现了问题，请稍后再试。')
      } finally {
        store.setIsStreaming(false)
        // 刷新对话列表（标题可能更新了）
        loadConversations()
      }
    },
    [store.isStreaming, store.currentConversationId, store.sessionId],
  )

  /** 新建对话 */
  const newChat = useCallback(() => {
    store.resetChat()
  }, [])

  /** 切换对话 */
  const switchConversation = useCallback(
    (id: string) => {
      loadMessages(id)
    },
    [],
  )

  /** 删除对话 */
  const removeConversation = useCallback(async (id: string) => {
    try {
      await deleteConversation(id)
      store.removeConversation(id)
    } catch {
      // 静默失败
    }
  }, [])

  return {
    ...store,
    loadConversations,
    loadMessages,
    sendMessage,
    newChat,
    switchConversation,
    removeConversation,
  }
}
