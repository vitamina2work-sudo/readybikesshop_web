import { USE_LOCAL_MOCK } from '@/config/dataSource'

type QueryResult<T> = {
  data: T | null
  error: { message: string; code?: string } | null
  status: number
}

export function isSupabaseUnavailable(status: number, error: QueryResult<unknown>['error']): boolean {
  if (status === 402) return true
  if (status === 0) return true
  if (status >= 500) return true
  if (!error) return false

  const message = error.message.toLowerCase()
  return (
    message.includes('failed to fetch') ||
    message.includes('networkerror') ||
    message.includes('payment required') ||
    error.code === '402'
  )
}

function logFallback(status: number, error: QueryResult<unknown>['error']): void {
  if (status === 402 || error?.code === '402') {
    console.warn('[Supabase] HTTP 402 Payment Required — usando datos de respaldo')
    return
  }
  if (error) {
    console.warn('[Supabase] consulta fallida — usando datos de respaldo:', error.message)
    return
  }
  console.warn(`[Supabase] HTTP ${status} — usando datos de respaldo`)
}

/**
 * Reads a Supabase/PostgREST query and returns `null` on quota (402),
 * non-200 responses, or network errors so callers can serve static fallback data.
 */
const QUERY_TIMEOUT_MS = 8000

function withTimeout<T>(promise: PromiseLike<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = globalThis.setTimeout(() => {
      reject(new Error('Supabase timeout'))
    }, ms)

    Promise.resolve(promise).then(
      (value) => {
        globalThis.clearTimeout(timer)
        resolve(value)
      },
      (err: unknown) => {
        globalThis.clearTimeout(timer)
        reject(err)
      }
    )
  })
}

export async function safeQuery<T>(query: PromiseLike<QueryResult<T>>): Promise<T | null> {
  if (USE_LOCAL_MOCK) return null

  try {
    const res = await withTimeout(query, QUERY_TIMEOUT_MS)

    if (
      res.status === 402 ||
      isSupabaseUnavailable(res.status, res.error) ||
      res.error ||
      res.data == null ||
      (res.status !== 200 && res.status !== 206)
    ) {
      logFallback(res.status, res.error)
      return null
    }

    return res.data
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error de red'
    console.warn('[Supabase] error de red — usando datos de respaldo:', message)
    return null
  }
}
