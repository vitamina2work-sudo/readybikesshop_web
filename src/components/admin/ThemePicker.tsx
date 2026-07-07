import { useTranslation } from 'react-i18next'
import { Check } from 'lucide-react'
import {
  COLOR_THEME_IDS,
  colorThemes,
  type ColorThemeId,
} from '@/lib/colorThemes'
import { cn } from '@/lib/utils'

interface ThemePickerProps {
  value: string
  onChange: (themeId: ColorThemeId) => void
}

export function ThemePicker({ value, onChange }: ThemePickerProps) {
  const { t } = useTranslation()
  const selected = (value in colorThemes ? value : 'classic') as ColorThemeId

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {COLOR_THEME_IDS.map((id) => {
        const theme = colorThemes[id]
        const isSelected = selected === id

        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              'relative rounded-xl border-2 p-4 text-left transition-all hover:shadow-md',
              isSelected
                ? 'border-primary ring-2 ring-primary/20'
                : 'border-border hover:border-primary/40'
            )}
          >
            {isSelected && (
              <span className="absolute top-2 right-2 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="size-3" />
              </span>
            )}
            <div className="flex gap-2 mb-3">
              <span
                className="size-8 rounded-lg border shadow-inner"
                style={{ backgroundColor: theme.swatch.background }}
              />
              <span
                className="size-8 rounded-lg border shadow-sm"
                style={{ backgroundColor: theme.swatch.primary }}
              />
            </div>
            <p className="font-medium text-sm">{t(`admin.site.themes.${id}.name`)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t(`admin.site.themes.${id}.desc`)}
            </p>
          </button>
        )
      })}
    </div>
  )
}
