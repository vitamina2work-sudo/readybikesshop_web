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
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg">
              <Bike className="size-5 text-primary" />
              {siteConfig.name}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{t('site.description')}</p>
          </div>

          <div>
            <h3 className="font-semibold text-sm">{t('site.hoursTitle')}</h3>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              <li>{t('site.hoursWeekdays')}</li>
              <li>{t('site.hoursSaturday')}</li>
              <li>{t('site.hoursSunday')}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm">{t('site.contactTitle')}</h3>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              <li>{siteConfig.address}</li>
              <li>
                <a
                  href={`tel:+34${siteConfig.phone.replace(/\D/g, '')}`}
                  className="hover:text-primary transition-colors"
                >
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-primary transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. {t('site.rights')}
          </p>
          <Link to="/admin" className="text-xs text-muted-foreground hover:text-primary transition-colors">
            {t('common.admin')}
          </Link>
        </div>
      </div>
    </footer>
  )
}
