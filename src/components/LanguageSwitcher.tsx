import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { supportedLanguages, type SupportedLanguage } from '@/i18n'

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation()

  return (
    <Select
      value={i18n.language}
      onValueChange={(value) => i18n.changeLanguage(value as SupportedLanguage)}
    >
      <SelectTrigger className="w-[110px] h-8" aria-label={t('language.label')}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {supportedLanguages.map((lng) => (
          <SelectItem key={lng} value={lng}>
            {t(`language.${lng}`)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
