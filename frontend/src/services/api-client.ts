import { useSessionStore } from '@/store/session-store'

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = useSessionStore.getState().token
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorData = null
    try {
      errorData = await response.json()
    } catch {
      // ignore
    }
    throw new ApiError(
      response.status,
      errorData?.message || `HTTP error ${response.status}`,
      errorData
    )
  }

  return response.json() as Promise<T>
}

