import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Layout, Palette, Save } from 'lucide-react'
import {
  defaultSiteSettings,
  fetchSiteSettings,
  saveSiteSettings,
  SERVICE_IMAGE_KEYS,
  type SiteSettings,
} from '@/lib/siteSettings'
import { uploadImage } from '@/lib/supabase'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { ThemePicker } from '@/components/admin/ThemePicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { siteConfig } from '@/config/site'
import { toast } from 'sonner'

export function SitePage() {
  const { t } = useTranslation()
  const { refresh } = useSiteSettings()
  const [form, setForm] = useState<SiteSettings>(defaultSiteSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchSiteSettings()
      .then(setForm)
      .finally(() => setLoading(false))
  }, [])

  const update = (key: keyof SiteSettings, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    const { error } = await saveSiteSettings(form)
    setSaving(false)

    if (error) {
      const hint = error.message.includes('site_settings')
        ? ' — ¿Ejecutaste 004_site_settings.sql en Supabase?'
        : error.message.includes('policy') || error.message.includes('403')
          ? ' — ¿Tu usuario tiene rol admin?'
          : ''
      toast.error(`${error.message}${hint}`)
      return
    }

    await refresh()
    toast.success(t('admin.site.saved'))
  }

  if (loading) {
    return <p className="text-muted-foreground">{t('common.loading')}</p>
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('admin.site.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('admin.site.subtitle')}</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="size-4" />
          {saving ? t('common.loading') : t('common.save')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Palette className="size-5 text-primary" />
            {t('admin.site.colorTheme')}
          </CardTitle>
          <CardDescription>{t('admin.site.colorThemeHint')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemePicker
            value={form.color_theme}
            onChange={(id) => update('color_theme', id)}
          />
          <p className="mt-3 text-xs text-muted-foreground">
            {t('admin.site.colorThemeNote')}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Layout className="size-5 text-primary" />
            {t('admin.site.mainImages')}
          </CardTitle>
          <CardDescription>{t('admin.site.mainImagesHint')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUpload
            label={t('admin.site.hero')}
            hint={t('admin.site.heroHint')}
            aspect="banner"
            value={form.hero_image_url}
            onChange={(url) => update('hero_image_url', url)}
            onUpload={(file) => uploadImage(file, 'site')}
          />
          <ImageUpload
            label={t('admin.site.logo')}
            hint={t('admin.site.logoHint')}
            aspect="square"
            value={form.logo_url}
            onChange={(url) => update('logo_url', url)}
            onUpload={(file) => uploadImage(file, 'site')}
          />
          <ImageUpload
            label={t('admin.site.about')}
            hint={t('admin.site.aboutHint')}
            aspect="wide"
            value={form.about_image_url}
            onChange={(url) => update('about_image_url', url)}
            onUpload={(file) => uploadImage(file, 'site')}
          />
          <ImageUpload
            label={t('admin.site.cta')}
            hint={t('admin.site.ctaHint')}
            aspect="wide"
            value={form.cta_image_url}
            onChange={(url) => update('cta_image_url', url)}
            onUpload={(file) => uploadImage(file, 'site')}
          />
          <ImageUpload
            label={t('admin.site.catalogBanner')}
            hint={t('admin.site.catalogBannerHint')}
            aspect="banner"
            value={form.catalog_banner_url}
            onChange={(url) => update('catalog_banner_url', url)}
            onUpload={(file) => uploadImage(file, 'site')}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Image className="size-5 text-primary" />
            {t('admin.site.serviceImages')}
          </CardTitle>
          <CardDescription>{t('admin.site.serviceImagesHint')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          {siteConfig.services.map((service) => {
            const key = SERVICE_IMAGE_KEYS[service.key]
            return (
              <ImageUpload
                key={service.key}
                label={t(`services.${service.key}.title`)}
                aspect="video"
                value={form[key]}
                onChange={(url) => update(key, url)}
                onUpload={(file) => uploadImage(file, 'site')}
              />
            )
          })}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">{t('admin.site.otherImagesHint')}</p>
    </div>
  )
}
