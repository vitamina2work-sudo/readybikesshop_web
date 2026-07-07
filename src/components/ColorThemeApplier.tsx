import { useEffect } from 'react'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { useTheme } from '@/hooks/useTheme'
import { applyColorTheme, parseColorThemeId } from '@/lib/colorThemes'

/** Applies admin-selected brand palette on top of light/dark mode */
export function ColorThemeApplier() {
  const { settings } = useSiteSettings()
  const { theme } = useTheme()

  useEffect(() => {
    applyColorTheme(parseColorThemeId(settings.color_theme), theme === 'dark')
  }, [settings.color_theme, theme])

  return null
}
