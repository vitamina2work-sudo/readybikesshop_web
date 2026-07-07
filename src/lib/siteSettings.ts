import { supabase } from '@/lib/supabase'

export const SITE_SETTING_KEYS = [
  'hero_image_url',
  'logo_url',
  'cta_image_url',
  'catalog_banner_url',
  'about_image_url',
  'service_image_mechanics',
  'service_image_tyres',
  'service_image_electric',
  'service_image_itv',
  'color_theme',
] as const

export type SiteSettingKey = (typeof SITE_SETTING_KEYS)[number]

export type SiteSettings = Record<SiteSettingKey, string>

export const defaultSiteSettings: SiteSettings = {
  hero_image_url: '',
  logo_url: '',
  cta_image_url: '',
  catalog_banner_url: '',
  about_image_url: '',
  service_image_mechanics: '',
  service_image_tyres: '',
  service_image_electric: '',
  service_image_itv: '',
  color_theme: 'classic',
}

export const SERVICE_IMAGE_KEYS: Record<string, SiteSettingKey> = {
  mechanics: 'service_image_mechanics',
  tyres: 'service_image_tyres',
  electric: 'service_image_electric',
  itv: 'service_image_itv',
}

function rowsToSettings(rows: { key: string; value: string }[]): SiteSettings {
  const settings = { ...defaultSiteSettings }
  for (const row of rows) {
    if (row.key in settings) {
      settings[row.key as SiteSettingKey] = row.value ?? ''
    }
  }
  return settings
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from('site_settings').select('key, value')

  if (error || !data) return { ...defaultSiteSettings }
  return rowsToSettings(data)
}

export async function saveSiteSettings(
  updates: Partial<SiteSettings>
): Promise<{ error: Error | null }> {
  const entries = Object.entries(updates) as [SiteSettingKey, string][]

  for (const [key, value] of entries) {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ key, value: value ?? '' }, { onConflict: 'key' })

    if (error) return { error: new Error(error.message) }
  }

  return { error: null }
}
