import { create } from 'zustand'
import type { Conversation, Message } from '../types/chat'

interface ChatState {
  // 当前会话
  conversations: Conversation[]
  currentConversationId: string | null
  messages: Message[]
  isStreaming: boolean

  // 临时会话ID（匿名用户）
  sessionId: string

  // Actions
  setConversations: (conversations: Conversation[]) => void
  setCurrentConversationId: (id: string | null) => void
  setMessages: (messages: Message[]) => void
  addMessage: (message: Message) => void
  appendContent: (content: string) => void
  setIsStreaming: (v: boolean) => void
  updateConversationTitle: (id: string, title: string) => void
  removeConversation: (id: string) => void
  resetChat: () => void
}

function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem('sessionId')
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`
    sessionStorage.setItem('sessionId', id)
  }
  return id
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  currentConversationId: null,
  messages: [],
  isStreaming: false,
  sessionId: getOrCreateSessionId(),

  setConversations: (conversations) => set({ conversations }),
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  appendContent: (content) =>
    set((state) => {
      const msgs = [...state.messages]
      const lastMsg = msgs[msgs.length - 1]
      if (lastMsg && lastMsg.role === 'assistant') {
        msgs[msgs.length - 1] = {
          ...lastMsg,
          content: lastMsg.content + content,
        }
      }
      return { messages: msgs }
    }),

  setIsStreaming: (v) => set({ isStreaming: v }),

  updateConversationTitle: (id, title) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, title } : c,
      ),
    })),

  removeConversation: (id) =>
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      currentConversationId:
        state.currentConversationId === id
          ? null
          : state.currentConversationId,
      messages:
        state.currentConversationId === id ? [] : state.messages,
    })),

  resetChat: () =>
    set({
      currentConversationId: null,
      messages: [],
      isStreaming: false,
    }),
}))
