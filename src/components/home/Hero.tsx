import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, MessageCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { buildAppointmentWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp'

export function Hero() {
  const { t } = useTranslation()
  const { settings } = useSiteSettings()
  const appointmentUrl = buildWhatsAppUrl(buildAppointmentWhatsAppMessage(t))

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {settings.hero_image_url ? (
        <>
          <img
            src={settings.hero_image_url}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40 dark:from-background/98 dark:via-background/85 dark:to-background/50" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-background to-background" />
          <div className="absolute -right-32 -top-32 size-[500px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -left-20 bottom-0 size-80 rounded-full bg-primary/5 blur-3xl" />
        </>
      )}

      <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="max-w-2xl animate-slide-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            {t('hero.badge')}
          </p>
          <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl lg:leading-[1.1]">
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl">
            {t('hero.subtitle')}
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" variant="whatsapp" className="shadow-lg" asChild>
              <a href={appointmentUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" />
                {t('hero.appointment')}
              </a>
            </Button>
            <Button size="lg" variant="outline" className="bg-background/60 backdrop-blur-sm" asChild>
              <Link to="/catalogo">
                {t('hero.catalog')}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
