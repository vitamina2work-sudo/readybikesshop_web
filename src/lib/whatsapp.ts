import { siteConfig } from '@/config/site'
import type { TFunction } from 'i18next'

const localeMap: Record<string, string> = {
  es: 'es-ES',
  ca: 'ca-ES',
  en: 'en-GB',
}

export function getLocale(language: string): string {
  return localeMap[language] ?? 'es-ES'
}

export function formatPriceLocalized(price: number, language: string): string {
  return new Intl.NumberFormat(getLocale(language), {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function buildWhatsAppUrl(message: string): string {
  const phone = siteConfig.whatsappNumber.replace(/\D/g, '')
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}

export function buildArticleWhatsAppMessage(
  t: TFunction,
  title: string,
  price: number,
  language: string
): string {
  return t('whatsapp.article', {
    name: siteConfig.name,
    title,
    price: formatPriceLocalized(price, language),
  })
}

export function buildAppointmentWhatsAppMessage(t: TFunction): string {
  return t('whatsapp.appointment', { name: siteConfig.name })
}

export function buildGeneralWhatsAppMessage(t: TFunction): string {
  return t('whatsapp.general', { name: siteConfig.name })
}
