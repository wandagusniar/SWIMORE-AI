import { create } from 'zustand'
import { ephemeralStorage, DecryptedMessage } from '@/services/storage-service'

export interface ChatThreadMeta {
  id: string
  title: string
  modelId: string
  isPrivate: boolean
  updatedAt: string
}

interface ChatState {
  activeSessionId: string
  isPrivateMode: boolean
  activeModel: string
  savedThreads: ChatThreadMeta[]
  privateThreads: ChatThreadMeta[]
  currentMessages: DecryptedMessage[]
  isStreaming: boolean

  // Actions
  setIsPrivateMode: (isPrivate: boolean) => void
  setActiveModel: (model: string) => void
  selectSession: (sessionId: string) => Promise<void>
  createNewChat: (isPrivate?: boolean) => Promise<string>
  sendMessage: (content: string) => Promise<void>
  purgePrivateChat: (sessionId?: string) => Promise<void>
}

export const useChatStore = create<ChatState>((set, get) => ({
  activeSessionId: 'session_curl_demo',
  isPrivateMode: false,
  activeModel: 'Claude 3.5 Sonnet',
  savedThreads: [
    { id: 'session_fallback', title: 'Fallback routing question', modelId: 'Claude 3.5 Sonnet', isPrivate: false, updatedAt: '2h' },
    { id: 'session_compare', title: 'Compare Claude vs DeepSeek', modelId: 'DeepSeek R1', isPrivate: false, updatedAt: '1d' },
    { id: 'session_curl_demo', title: 'cURL for chat endpoint', modelId: 'Claude 3.5 Sonnet', isPrivate: false, updatedAt: '2d' },
  ],
  privateThreads: [],
  currentMessages: [
    {
      id: 'msg_init_user',
      sessionId: 'session_curl_demo',
      role: 'user',
      content: 'Write a cURL call for the chat endpoint.',
      timestamp: Date.now() - 100000,
    },
    {
      id: 'msg_init_assistant',
      sessionId: 'session_curl_demo',
      role: 'assistant',
      content:
        'Here is a minimal request. Swap in your key and the model you want routed:\n\n```bash\ncurl https://api.swimore.ai/v1/chat/completions \\\n  -H "Authorization: Bearer $SWIMORE_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"model":"claude-3.5-sonnet","messages":[{"role":"user","content":"Hi!"}]}\'\n```',
      trace: {
        path: 'Path A',
        model: 'Claude 3.5 Sonnet',
        latency: '410 ms',
      },
      timestamp: Date.now() - 95000,
    },
  ],
  isStreaming: false,

  setIsPrivateMode: (isPrivate) => {
    set({ isPrivateMode: isPrivate })
  },

  setActiveModel: (activeModel) => {
    set({ activeModel })
  },

  selectSession: async (sessionId) => {
    const isPrivate = get().isPrivateMode
    try {
      const messages = await ephemeralStorage.getMessages(sessionId)
      if (messages.length > 0) {
        set({ activeSessionId: sessionId, currentMessages: messages })
      } else {
        set({ activeSessionId: sessionId })
      }
    } catch (err) {
      console.warn('Error loading messages from ephemeral storage:', err)
      set({ activeSessionId: sessionId })
    }
  },

  createNewChat: async (isPrivateOverride) => {
    const isPrivate = isPrivateOverride !== undefined ? isPrivateOverride : get().isPrivateMode
    const newId = `session_${Date.now()}`
    const model = get().activeModel
    const newThread: ChatThreadMeta = {
      id: newId,
      title: isPrivate ? 'Private chat' : 'New chat',
      modelId: model,
      isPrivate,
      updatedAt: 'now',
    }

    await ephemeralStorage.createSession(newId, newThread.title, model, isPrivate)

    set((state) => ({
      activeSessionId: newId,
      isPrivateMode: isPrivate,
      currentMessages: [],
      savedThreads: isPrivate ? state.savedThreads : [newThread, ...state.savedThreads],
      privateThreads: isPrivate ? [newThread, ...state.privateThreads] : state.privateThreads,
    }))

    return newId
  },

  sendMessage: async (content) => {
    const { activeSessionId, isPrivateMode, activeModel } = get()
    const now = Date.now()

    const userMsg: DecryptedMessage = {
      id: `msg_u_${now}`,
      sessionId: activeSessionId,
      role: 'user',
      content,
      timestamp: now,
    }

    set((state) => ({
      currentMessages: [...state.currentMessages, userMsg],
      isStreaming: true,
    }))

    // Save to ephemeral storage with Web Crypto AES-GCM
    await ephemeralStorage.saveMessage(activeSessionId, {
      role: 'user',
      content,
    })

    // Simulated Gateway Streaming Response
    setTimeout(async () => {
      const assistantMsg: DecryptedMessage = {
        id: `msg_a_${Date.now()}`,
        sessionId: activeSessionId,
        role: 'assistant',
        content: `I routed your request to ${activeModel}. Response dispatched in sub-second streaming flusher with zero token leak.`,
        trace: {
          path: 'Path A',
          model: activeModel,
          latency: '340 ms',
        },
        timestamp: Date.now(),
      }

      await ephemeralStorage.saveMessage(activeSessionId, {
        role: 'assistant',
        content: assistantMsg.content,
        trace: assistantMsg.trace,
      })

      set((state) => ({
        currentMessages: [...state.currentMessages, assistantMsg],
        isStreaming: false,
      }))
    }, 450)
  },

  purgePrivateChat: async (sessionId) => {
    const targetId = sessionId || get().activeSessionId
    if (!targetId) return
    await ephemeralStorage.zeroLogScrub(targetId)
    set((state) => ({
      privateThreads: state.privateThreads.filter((t) => t.id !== targetId),
      currentMessages: state.activeSessionId === targetId ? [] : state.currentMessages,
      activeSessionId: state.activeSessionId === targetId ? '' : state.activeSessionId,
    }))
  },
}))

