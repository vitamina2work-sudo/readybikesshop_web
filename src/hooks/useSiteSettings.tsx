import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { STATIC_SITE_SETTINGS } from '@/data/staticData'
import { fetchSiteSettings, type SiteSettings } from '@/lib/siteSettings'

interface SiteSettingsContextValue {
  settings: SiteSettings
  loading: boolean
  refresh: () => Promise<void>
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(
  undefined
)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(STATIC_SITE_SETTINGS)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const data = await fetchSiteSettings()
      setSettings(data)
    } catch {
      setSettings({ ...STATIC_SITE_SETTINGS })
    }
  }, [])

  useEffect(() => {
    fetchSiteSettings()
      .then(setSettings)
      .catch(() => setSettings({ ...STATIC_SITE_SETTINGS }))
      .finally(() => setLoading(false))
  }, [])

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SiteSettingsContext.Provider>
  )
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext)
  if (!ctx) {
    throw new Error('useSiteSettings must be used within SiteSettingsProvider')
  }
  return ctx
}
