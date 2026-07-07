import { supabase } from '@/lib/supabase'

export type DiagnosticStatus = 'ok' | 'warn' | 'error' | 'pending'

export interface DiagnosticCheck {
  id: string
  label: string
  status: DiagnosticStatus
  detail: string
  hint?: string
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const SUPABASE_PROJECT_REF_RE = /^https:\/\/([a-z0-9]{15,24})\.supabase\.co\/?$/

function extractProjectRef(url: string): string | null {
  const match = url.match(SUPABASE_PROJECT_REF_RE)
  return match?.[1] ?? null
}

export function getSupabaseConfig() {
  const projectRef = supabaseUrl ? extractProjectRef(supabaseUrl) : null
  return {
    url: supabaseUrl ?? '',
    projectRef,
    keyPreview: supabaseAnonKey
      ? `${supabaseAnonKey.slice(0, 16)}…${supabaseAnonKey.slice(-4)}`
      : '',
    hasUrl: Boolean(supabaseUrl),
    hasKey: Boolean(supabaseAnonKey),
    hasValidUrlFormat: Boolean(projectRef),
    isPlaceholder:
      !supabaseUrl ||
      supabaseUrl.includes('your-project') ||
      supabaseUrl.includes('placeholder') ||
      !supabaseAnonKey ||
      supabaseAnonKey.includes('your-anon') ||
      supabaseAnonKey === 'placeholder-key',
  }
}

function isNetworkError(message: string): boolean {
  const lower = message.toLowerCase()
  return lower.includes('failed to fetch') || lower.includes('networkerror')
}

function networkHint(projectRef?: string | null): string {
  const ref = projectRef ? ` (ref: ${projectRef})` : ''
  return (
    'El .env parece correcto, pero el navegador no llega al servidor de Supabase. ' +
    '1) Abre la Project URL en una pestaña nueva — si dice «no se puede acceder», el proyecto está pausado, creándose o con DNS roto en Supabase. ' +
    '2) En el dashboard revisa el estado del proyecto (Active / Paused / Coming up). Si está pausado, pulsa Restore. ' +
    '3) Si sigue fallando, abre un ticket en supabase.com/dashboard/support/new' +
    ref +
    '. ' +
    '4) Desactiva bloqueadores (uBlock). ' +
    '5) En Authentication → URL Configuration añade http://localhost:5173/**'
  )
}

async function probeSupabaseHost(url: string): Promise<{ ok: boolean; detail: string }> {
  try {
    const response = await fetch(`${url.replace(/\/$/, '')}/auth/v1/health`, {
      method: 'GET',
      headers: { apikey: supabaseAnonKey ?? '' },
    })
    return { ok: true, detail: `Host responde (HTTP ${response.status})` }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    return { ok: false, detail: message }
  }
}

export async function runSupabaseDiagnostics(): Promise<DiagnosticCheck[]> {
  const checks: DiagnosticCheck[] = []
  const config = getSupabaseConfig()

  const urlStatus: DiagnosticStatus =
    !config.hasUrl || config.isPlaceholder
      ? 'error'
      : config.hasValidUrlFormat
        ? 'ok'
        : 'error'

  checks.push({
    id: 'env-url',
    label: 'Variable VITE_SUPABASE_URL',
    status: urlStatus,
    detail: config.hasUrl ? config.url : 'No definida',
    hint:
      !config.hasUrl || config.isPlaceholder
        ? 'Crea o edita .env con la URL de Supabase → Project Settings → API → Project URL.'
        : !config.hasValidUrlFormat
          ? `Formato inválido. Debe ser https://TU-PROJECT-ID.supabase.co. ` +
            `Cópiala en Supabase → Integrations → Data API, o mira el ID en la URL del navegador tras /project/.`
          : undefined,
  })

  checks.push({
    id: 'env-key',
    label: 'Variable VITE_SUPABASE_ANON_KEY',
    status: config.hasKey && !config.isPlaceholder ? 'ok' : 'error',
    detail: config.hasKey ? config.keyPreview : 'No definida',
    hint:
      config.hasKey && !config.isPlaceholder
        ? undefined
        : 'Copia la Publishable key desde Supabase → Settings → API Keys.',
  })

  if (!config.hasUrl || config.isPlaceholder || !config.hasValidUrlFormat) {
    return checks
  }

  const hostProbe = await probeSupabaseHost(config.url)
  checks.push({
    id: 'host-reachable',
    label: 'Host Supabase (DNS / red)',
    status: hostProbe.ok ? 'ok' : 'error',
    detail: hostProbe.detail,
    hint: hostProbe.ok
      ? undefined
      : `Abre ${config.url} en el navegador. Si no carga, el problema está en Supabase (proyecto pausado, en creación o DNS no activo), no en tu código.`,
  })

  if (!hostProbe.ok) {
    return checks
  }

  // Prueba real de red — mismo endpoint que el login admin
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'diagnostico-conexion@test.local',
      password: '__test_connection__',
    })

    if (!error) {
      checks.push({
        id: 'auth-network',
        label: 'Auth API (login de prueba)',
        status: 'warn',
        detail: 'Respuesta inesperada — revisa configuración Auth',
      })
    } else if (isNetworkError(error.message)) {
      checks.push({
        id: 'auth-network',
        label: 'Auth API (login de prueba)',
        status: 'error',
        detail: error.message,
        hint: networkHint(config.projectRef),
      })
    } else {
      checks.push({
        id: 'auth-network',
        label: 'Auth API (login de prueba)',
        status: 'ok',
        detail: `Supabase responde: «${error.message}» (normal con credenciales de prueba)`,
      })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    checks.push({
      id: 'auth-network',
      label: 'Auth API (login de prueba)',
      status: 'error',
      detail: message,
      hint: networkHint(config.projectRef),
    })
  }

  // REST — lectura pública de categories
  try {
    const { error, count } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })

    if (error) {
      checks.push({
        id: 'rest-client',
        label: 'REST API (categories)',
        status: isNetworkError(error.message) ? 'error' : 'warn',
        detail: error.message,
        hint: isNetworkError(error.message)
          ? networkHint(config.projectRef)
          : error.message.includes('relation') || error.message.includes('does not exist')
            ? 'Ejecuta supabase/migrations/001_initial_schema.sql en el SQL Editor de Supabase.'
            : 'Revisa RLS o migraciones en Supabase.',
      })
    } else {
      checks.push({
        id: 'rest-client',
        label: 'REST API (categories)',
        status: 'ok',
        detail: `Conexión OK — ${count ?? 0} categoría(s) en base de datos`,
      })
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error desconocido'
    checks.push({
      id: 'rest-client',
      label: 'REST API (categories)',
      status: 'error',
      detail: message,
      hint: networkHint(config.projectRef),
    })
  }

  return checks
}

export function getOverallStatus(checks: DiagnosticCheck[]): DiagnosticStatus {
  if (checks.some((c) => c.status === 'error')) return 'error'
  if (checks.some((c) => c.status === 'warn')) return 'warn'
  return 'ok'
}
