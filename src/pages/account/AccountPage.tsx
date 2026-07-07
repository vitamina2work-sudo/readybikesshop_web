import { useEffect, useState, type FormEvent } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

export function AccountPage() {
  const { t } = useTranslation()
  const { user, profile, loading, updateProfile, signOut } = useAuth()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setPhone(profile.phone ?? '')
    }
  }, [profile])

  if (loading) return null
  if (!user) return <Navigate to="/cuenta/iniciar-sesion" replace />

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await updateProfile({
      full_name: fullName.trim(),
      phone: phone.trim() || undefined,
    })
    setSaving(false)

    if (error) toast.error(error.message || t('account.profileError'))
    else toast.success(t('account.profileSaved'))
  }

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : '—'

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('account.profileTitle')}</CardTitle>
          <CardDescription>{t('account.profileSubtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            {user.email} · {t('account.memberSince')} {memberSince}
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{t('account.fullName')}</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('account.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={saving}>
                {saving ? t('account.saving') : t('common.save')}
              </Button>
              <Button type="button" variant="outline" onClick={signOut}>
                {t('nav.logout')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
