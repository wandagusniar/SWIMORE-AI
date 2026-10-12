import { useSessionStore } from '@/store/session-store'

export interface ChatCompletionRequestMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatCompletionStreamChunk {
  id: string
  model: string
  choices: Array<{
    index: number
    delta: {
      role?: string
      content?: string
    }
    finish_reason: string | null
  }>
}

export async function streamChatCompletion(
  model: string,
  messages: ChatCompletionRequestMessage[],
  onChunk: (delta: string) => void,
  onDone: (fullText: string, trace?: { path: string; model: string; latency: string }) => void,
  onError: (err: Error) => void
): Promise<void> {
  const token = useSessionStore.getState().token
  const startTime = Date.now()

  try {
    const response = await fetch('/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token || 'anon'}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
      }),
    })

    if (!response.ok) {
      throw new Error(`Gateway returned HTTP ${response.status}`)
    }

    if (!response.body) {
      throw new Error('Response body is null')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let accumulated = ''
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith(':')) continue

        if (trimmed === 'data: [DONE]') {
          const latency = `${Date.now() - startTime} ms`
          onDone(accumulated, {
            path: 'Path A',
            model,
            latency,
          })
          return
        }

        if (trimmed.startsWith('data: ')) {
          try {
            const data: ChatCompletionStreamChunk = JSON.parse(trimmed.slice(6))
            const delta = data.choices[0]?.delta?.content || ''
            if (delta) {
              accumulated += delta
              onChunk(delta)
            }
          } catch {
            // ignore non-json keep-alive
          }
        }
      }
    }

    const latency = `${Date.now() - startTime} ms`
    onDone(accumulated, {
      path: 'Path A',
      model,
      latency,
    })
  } catch (err: any) {
    onError(err instanceof Error ? err : new Error(String(err)))
  }
}

