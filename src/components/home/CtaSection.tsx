import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { buildGeneralWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp'

export function CtaSection() {
  const { t } = useTranslation()
  const { settings } = useSiteSettings()
  const whatsappUrl = buildWhatsAppUrl(buildGeneralWhatsAppMessage(t))

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border bg-card shadow-xl">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
              <h2 className="text-2xl font-bold sm:text-3xl lg:text-4xl">{t('cta.title')}</h2>
              <p className="mt-4 text-muted-foreground text-lg leading-relaxed">{t('cta.subtitle')}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="whatsapp" size="lg" asChild>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-4" />
                    {t('cta.whatsapp')}
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/catalogo">
                    {t('cta.catalog')}
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative min-h-[280px] bg-muted lg:min-h-full">
              {settings.cta_image_url ? (
                <img
                  src={settings.cta_image_url}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-primary/10 to-transparent flex items-center justify-center">
                  <MessageCircle className="size-24 text-primary/25" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
