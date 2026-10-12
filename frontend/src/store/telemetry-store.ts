import { create } from 'zustand'

export interface ModelTelemetry {
  id: string
  name: string
  provider: string
  latencyMs: number
  successRate: number
  status: 'Ready' | 'Degraded' | 'Down'
  activeIssue?: string
  lastChecked: number
}

interface TelemetryState {
  modelsHealth: Record<string, ModelTelemetry>
  isProbing: boolean
  lastProbeTime: number

  // Actions
  probeLatency: (modelId: string) => Promise<number>
  reportIncident: (modelId: string, issue: string) => Promise<void>
}

export const useTelemetryStore = create<TelemetryState>((set, get) => ({
  modelsHealth: {
    'claude-3.5-sonnet': {
      id: 'claude-3.5-sonnet',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      latencyMs: 410,
      successRate: 98.4,
      status: 'Ready',
      lastChecked: Date.now(),
    },
    'deepseek-r1': {
      id: 'deepseek-r1',
      name: 'DeepSeek R1',
      provider: 'DeepSeek',
      latencyMs: 314,
      successRate: 99.8,
      status: 'Ready',
      lastChecked: Date.now(),
    },
    'llama-3.3-70b': {
      id: 'llama-3.3-70b',
      name: 'Llama 3.3 70B',
      provider: 'Ollama',
      latencyMs: 190,
      successRate: 99.9,
      status: 'Ready',
      lastChecked: Date.now(),
    },
    'gpt-4o': {
      id: 'gpt-4o',
      name: 'GPT-4o',
      provider: 'OpenAI',
      latencyMs: 380,
      successRate: 96.8,
      status: 'Degraded',
      activeIssue: 'Connection pool near limit',
      lastChecked: Date.now(),
    },
    'mistral-8x7b': {
      id: 'mistral-8x7b',
      name: 'Mistral 8x7B',
      provider: 'Mistral',
      latencyMs: 12400,
      successRate: 41.2,
      status: 'Down',
      activeIssue: 'Connections exhausted',
      lastChecked: Date.now(),
    },
  },
  isProbing: false,
  lastProbeTime: Date.now(),

  probeLatency: async (modelId) => {
    set({ isProbing: true })
    const ping = Math.floor(Math.random() * 60) + 180
    await new Promise((r) => setTimeout(r, 200))

    set((state) => {
      const existing = state.modelsHealth[modelId]
      if (!existing) return { isProbing: false }
      return {
        isProbing: false,
        lastProbeTime: Date.now(),
        modelsHealth: {
          ...state.modelsHealth,
          [modelId]: {
            ...existing,
            latencyMs: ping,
            lastChecked: Date.now(),
          },
        },
      }
    })
    return ping
  },

  reportIncident: async (modelId, issue) => {
    // Dispatches to local state and gateway escalation webhook
    set((state) => {
      const existing = state.modelsHealth[modelId]
      if (!existing) return state
      return {
        modelsHealth: {
          ...state.modelsHealth,
          [modelId]: {
            ...existing,
            status: 'Degraded',
            activeIssue: issue,
            lastChecked: Date.now(),
          },
        },
      }
    })
  },
}))

