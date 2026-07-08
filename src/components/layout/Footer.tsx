import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Bike } from 'lucide-react'
import { siteConfig } from '@/config/site'
import { buildGeneralWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp'

export function Footer() {
  const { t } = useTranslation()
  const whatsappUrl = buildWhatsAppUrl(buildGeneralWhatsAppMessage(t))

  return (
    <footer id="contacto" className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          className="grid gap-8 md:grid-cols-3"
          itemScope
          itemType="https://schema.org/LocalBusiness"
        >
          <div>
            <div className="flex items-center gap-2 font-bold text-lg">
              <Bike className="size-5 text-primary" />
              <span itemProp="name">{siteConfig.name}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground" itemProp="description">
              {t('site.description')}
            </p>
            <meta itemProp="url" content={siteConfig.url} />
          </div>

          <div>
            <h3 className="font-semibold text-sm">{t('site.hoursTitle')}</h3>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const).map(
                (day) => (
                  <li key={day}>{t(`site.hours.${day}`)}</li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm">{t('site.contactTitle')}</h3>
            <address className="mt-3 space-y-1 text-sm text-muted-foreground not-italic">
              <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                <span itemProp="streetAddress">Ctra. de Sabadell, 26</span>
                {', '}
                <span itemProp="postalCode">08211</span>{' '}
                <span itemProp="addressLocality">Castellar del Vallès</span>
                {', '}
                <span itemProp="addressRegion">Barcelona</span>
              </div>
              <div>
                <a
                  href={`tel:+34${siteConfig.phone.replace(/\D/g, '')}`}
                  className="hover:text-primary transition-colors"
                  itemProp="telephone"
                >
                  {siteConfig.phone}
                </a>
              </div>
              <div>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-primary transition-colors"
                  itemProp="email"
                >
                  {siteConfig.email}
                </a>
              </div>
              <div>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline"
                >
                  WhatsApp
                </a>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t pt-6 sm:flex-row sm:justify-center sm:gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. {t('site.rights')}
          </p>
          <span className="hidden text-xs text-muted-foreground sm:inline" aria-hidden>
            ·
          </span>
          <Link
            to="/politica-privacidad"
            className="text-xs text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
          >
            {t('site.privacyPolicy')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
