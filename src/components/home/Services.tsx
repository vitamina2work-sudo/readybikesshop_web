import { useTranslation } from 'react-i18next'
import {
  Wrench,
  CircleDot,
  Zap,
  ClipboardCheck,
  type LucideIcon,
} from 'lucide-react'
import { siteConfig } from '@/config/site'
import { SERVICE_IMAGE_KEYS } from '@/lib/siteSettings'
import { useSiteSettings } from '@/hooks/useSiteSettings'

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  CircleDot,
  Zap,
  ClipboardCheck,
}

export function Services() {
  const { t } = useTranslation()
  const { settings } = useSiteSettings()

  return (
    <section id="servicios" className="py-24 relative">
      <div className="absolute inset-0 bg-muted/40 -z-10" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center mb-16">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('services.title')}</h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">{t('services.subtitle')}</p>
          </div>
          {settings.about_image_url ? (
            <div className="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-border/50">
              <img
                src={settings.about_image_url}
                alt=""
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 ring-1 ring-primary/10 flex items-center justify-center">
              <Wrench className="size-16 text-primary/40" />
            </div>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? Wrench
            const imageKey = SERVICE_IMAGE_KEYS[service.key]
            const imageUrl = settings[imageKey]

            return (
              <article
                key={service.key}
                className="group overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt=""
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-gradient-to-br from-primary/15 to-transparent">
                      <Icon className="size-12 text-primary/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg">
                    <Icon className="size-5" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-base">{t(`services.${service.key}.title`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {t(`services.${service.key}.description`)}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
