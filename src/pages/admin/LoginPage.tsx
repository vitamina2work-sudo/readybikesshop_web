import { useState, useEffect, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { toast } from 'sonner'

export function LoginPage() {
  const { t } = useTranslation()
  const { user, profile, loading, profileLoading, isAdmin, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [awaitingProfile, setAwaitingProfile] = useState(false)
  const authResolving = loading || profileLoading

  useEffect(() => {
    if (!awaitingProfile || authResolving) return
    if (user && isAdmin) {
      setAwaitingProfile(false)
      return
    }
    if (user && !isAdmin) {
      setAwaitingProfile(false)
      toast.error(
        profile
          ? 'Tu cuenta no tiene rol de administrador. Ejecuta el SQL de promoción a admin en Supabase.'
          : 'Sesión iniciada, pero no se pudo cargar tu perfil (error RLS). Ejecuta 003_fix_profiles_rls.sql en Supabase.'
      )
    }
  }, [awaitingProfile, authResolving, user, isAdmin, profile])

  if (authResolving) return null
  if (user && isAdmin) return <Navigate to="/admin" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)

    if (error) {
      const lower = error.message.toLowerCase()
      const message =
        error.message === 'Failed to fetch'
          ? 'No se puede resolver el host de Supabase (DNS). Prueba: 1) Abre la Project URL en el navegador. 2) Cambia DNS de Windows a 1.1.1.1. 3) Revisa status.supabase.com. Más en /diagnostico.'
          : lower.includes('invalid login credentials') || lower.includes('invalid credentials')
            ? `${t('account.loginError')} — Crea el usuario en Supabase → Authentication → Users (proyecto nuevo).`
            : error.message || t('account.loginError')
      toast.error(message)
    } else {
      setAwaitingProfile(true)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="absolute top-4 right-4 flex gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-16 items-center justify-center">
            <BrandLogo variant="emblem" className="size-16" />
          </div>
          <CardTitle>{t('admin.loginTitle')}</CardTitle>
          <CardDescription>{t('admin.loginSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('account.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('account.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? t('account.loggingIn') : t('account.login')}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm">
            <Link to="/diagnostico" className="text-primary hover:underline">
              {t('diagnostics.title')}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
