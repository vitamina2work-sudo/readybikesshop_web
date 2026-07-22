import { siteConfig } from '@/config/site'
import { brandAssets } from '@/config/brand'

export interface PageSeoConfig {
  title: string
  description: string
  path?: string
  noindex?: boolean
  type?: 'website' | 'article'
}

export function getSiteOrigin() {
  const configured = siteConfig.url.replace(/\/$/, '')
  if (configured) return configured
  if (typeof window !== 'undefined') return window.location.origin
  return 'http://localhost:5173'
}

export function absoluteUrl(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${getSiteOrigin()}${normalized}`
}

function upsertMeta(selector: string, create: () => HTMLElement, content: string) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null
  if (!el) {
    el = create() as HTMLMetaElement | HTMLLinkElement
    document.head.appendChild(el)
  }
  if (el instanceof HTMLMetaElement) {
    el.content = content
  } else if (el instanceof HTMLLinkElement) {
    el.href = content
  }
}

export function applyPageSeo(config: PageSeoConfig, locale: string) {
  const path = config.path ?? '/'
  const url = absoluteUrl(path)
  const title = config.title
  const description = config.description
  const image = absoluteUrl(brandAssets.logoEmblem)
  const robots = config.noindex ? 'noindex, nofollow' : 'index, follow'

  document.title = title

  upsertMeta(
    'meta[name="description"]',
    () => {
      const meta = document.createElement('meta')
      meta.name = 'description'
      return meta
    },
    description
  )

  upsertMeta(
    'meta[name="robots"]',
    () => {
      const meta = document.createElement('meta')
      meta.name = 'robots'
      return meta
    },
    robots
  )

  upsertMeta(
    'link[rel="canonical"]',
    () => {
      const link = document.createElement('link')
      link.rel = 'canonical'
      return link
    },
    url
  )

  const ogTags: Record<string, string> = {
    'og:title': title,
    'og:description': description,
    'og:type': config.type ?? 'website',
    'og:url': url,
    'og:site_name': siteConfig.name,
    'og:locale': localeToOgLocale(locale),
    'og:image': image,
  }

  for (const [property, content] of Object.entries(ogTags)) {
    upsertMeta(
      `meta[property="${property}"]`,
      () => {
        const meta = document.createElement('meta')
        meta.setAttribute('property', property)
        return meta
      },
      content
    )
  }

  const twitterTags: Record<string, string> = {
    'twitter:card': 'summary',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
  }

  for (const [name, content] of Object.entries(twitterTags)) {
    upsertMeta(
      `meta[name="${name}"]`,
      () => {
        const meta = document.createElement('meta')
        meta.name = name
        return meta
      },
      content
    )
  }

  applyGeoMetaTags()
}

function localeToOgLocale(locale: string) {
  if (locale === 'ca') return 'ca_ES'
  if (locale === 'en') return 'en_GB'
  return 'es_ES'
}

function applyGeoMetaTags() {
  const { geo } = siteConfig
  const position = `${geo.latitude};${geo.longitude}`
  const icbm = `${geo.latitude}, ${geo.longitude}`

  upsertMeta(
    'meta[name="geo.region"]',
    () => {
      const meta = document.createElement('meta')
      meta.name = 'geo.region'
      return meta
    },
    geo.region
  )

  upsertMeta(
    'meta[name="geo.placename"]',
    () => {
      const meta = document.createElement('meta')
      meta.name = 'geo.placename'
      return meta
    },
    geo.placename
  )

  upsertMeta(
    'meta[name="geo.position"]',
    () => {
      const meta = document.createElement('meta')
      meta.name = 'geo.position'
      return meta
    },
    position
  )

  upsertMeta(
    'meta[name="ICBM"]',
    () => {
      const meta = document.createElement('meta')
      meta.name = 'ICBM'
      return meta
    },
    icbm
  )
}

export function buildLocalBusinessSchema(description: string) {
  const phoneE164 = `+34${siteConfig.phone.replace(/\D/g, '')}`

  return {
    '@context': 'https://schema.org',
    '@type': ['MotorcycleRepair', 'Store'],
    '@id': `${getSiteOrigin()}/#local-business`,
    name: siteConfig.name,
    description,
    url: getSiteOrigin(),
    image: absoluteUrl(brandAssets.logoEmblem),
    telephone: phoneE164,
    email: siteConfig.email,
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ctra. de Sabadell, 26',
      addressLocality: 'Castellar del Vallès',
      postalCode: '08211',
      addressRegion: 'Barcelona',
      addressCountry: 'ES',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: {
      '@type': 'City',
      name: 'Castellar del Vallès',
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: 'Barcelona',
      },
    },
    openingHoursSpecification: siteConfig.openingHours.flatMap((slot) =>
      slot.days.map((day) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: day,
        opens: slot.opens,
        closes: slot.closes,
      }))
    ),
    sameAs: [`https://wa.me/${siteConfig.whatsappNumber}`],
  }
}

export function buildWebSiteSchema(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${getSiteOrigin()}/#website`,
    name: siteConfig.name,
    description,
    url: getSiteOrigin(),
    inLanguage: ['es-ES', 'ca-ES', 'en-GB'],
    publisher: {
      '@id': `${getSiteOrigin()}/#local-business`,
    },
  }
}
