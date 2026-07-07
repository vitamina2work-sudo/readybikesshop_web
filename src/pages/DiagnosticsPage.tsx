import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { RefreshCw, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react'
import {
  getOverallStatus,
  getSupabaseConfig,
  runSupabaseDiagnostics,
  type DiagnosticCheck,
} from '@/lib/supabaseDiagnostics'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

function StatusIcon({ status }: { status: DiagnosticCheck['status'] }) {
  if (status === 'ok') return <CheckCircle2 className="size-5 text-green-500 shrink-0" />
  if (status === 'warn') return <AlertTriangle className="size-5 text-amber-500 shrink-0" />
  if (status === 'error') return <XCircle className="size-5 text-destructive shrink-0" />
  return <Loader2 className="size-5 animate-spin text-muted-foreground shrink-0" />
}

function statusBadge(status: DiagnosticCheck['status']) {
  const map = {
    ok: { label: 'OK', variant: 'sale' as const },
    warn: { label: 'Aviso', variant: 'outline' as const },
    error: { label: 'Error', variant: 'destructive' as const },
    pending: { label: '…', variant: 'outline' as const },
  }
  const { label, variant } = map[status]
  return <Badge variant={variant}>{label}</Badge>
}

export function DiagnosticsPage() {
  const { t } = useTranslation()
  const [checks, setChecks] = useState<DiagnosticCheck[]>([])
  const [running, setRunning] = useState(true)
  const config = getSupabaseConfig()

  const run = async () => {
    setRunning(true)
    const results = await runSupabaseDiagnostics()
    setChecks(results)
    setRunning(false)
  }

  useEffect(() => {
    run()
  }, [])

  const overall = checks.length ? getOverallStatus(checks) : 'pending'

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>{t('diagnostics.title')}</CardTitle>
              <CardDescription>{t('diagnostics.subtitle')}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={run} disabled={running}>
              <RefreshCw className={cn('size-4', running && 'animate-spin')} />
              {t('diagnostics.retry')}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-foreground/90">
            {t('diagnostics.useChrome')}
          </div>

          <div
            className={cn(
              'rounded-lg border p-4 text-sm',
              overall === 'ok' && 'border-green-500/30 bg-green-500/5',
              overall === 'warn' && 'border-amber-500/30 bg-amber-500/5',
              overall === 'error' && 'border-destructive/30 bg-destructive/5',
              overall === 'pending' && 'border-border bg-muted/30'
            )}
          >
            <p className="font-medium">{t(`diagnostics.overall.${overall}`)}</p>
            <p className="mt-1 text-muted-foreground text-xs break-all">
              {t('diagnostics.configuredUrl')}: {config.url || t('diagnostics.missing')}
            </p>
            {config.url && (
              <a
                href={config.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-primary hover:underline"
              >
                {t('diagnostics.openInBrowser')} ↗
              </a>
            )}
          </div>

          <ul className="space-y-3">
            {checks.map((check) => (
              <li key={check.id} className="rounded-lg border p-4">
                <div className="flex items-start gap-3">
                  <StatusIcon status={check.status} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{check.label}</span>
                      {statusBadge(check.status)}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground break-all">{check.detail}</p>
                    {check.hint && (
                      <p className="mt-2 text-xs rounded-md bg-muted px-3 py-2 text-foreground/80">
                        💡 {check.hint}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="text-xs text-muted-foreground space-y-1 border-t pt-4">
            <p>{t('diagnostics.help1')}</p>
            <p>{t('diagnostics.help2')}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/admin/login">{t('diagnostics.goAdmin')}</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">{t('nav.home')}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
