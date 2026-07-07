import { useTranslation } from 'react-i18next'
import { siteConfig } from '@/config/site'

const sectionKeys = [
  'controller',
  'data',
  'purpose',
  'legalBasis',
  'retention',
  'recipients',
  'rights',
  'cookies',
  'changes',
] as const

export function PrivacyPolicyPage() {
  const { t } = useTranslation()
  const vars = {
    name: siteConfig.name,
    email: siteConfig.email,
    address: siteConfig.address,
    phone: siteConfig.phone,
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">{t('privacy.title')}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{t('privacy.lastUpdated')}</p>
        <p className="mt-4 text-muted-foreground leading-relaxed">{t('privacy.intro', vars)}</p>
      </header>

      <div className="space-y-8">
        {sectionKeys.map((key) => (
          <section key={key}>
            <h2 className="text-lg font-semibold">{t(`privacy.sections.${key}.title`)}</h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {t(`privacy.sections.${key}.body`, vars)}
            </p>
          </section>
        ))}
      </div>
    </article>
  )
}
