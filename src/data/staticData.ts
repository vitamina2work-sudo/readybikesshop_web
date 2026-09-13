import type { ArticleWithCategory, Category } from '@/types/database'
import type { SiteSettings } from '@/lib/siteSettings'

const TS = '2026-01-01T00:00:00.000Z'

export const LOCAL_PLACEHOLDER_SRC = '/images/placeholder.svg'

export const STATIC_SITE = {
  name: 'Ready Motos',
  phone: '644 69 22 04',
  email: 'readycastellar@gmail.com',
  address: 'Ctra. de Sabadell, 26, 08211 Castellar del Vallès, Barcelona',
  instagramHandle: 'readymotos_',
  instagramUrl: 'https://www.instagram.com/readymotos_/',
  branding: {
    logoHorizontal: '/brand/logo-horizontal.png',
    logoEmblem: '/brand/logo-emblem.png',
  },
  hero: {
    badge: 'Taller & Escaparate',
    title: 'Tu moto en las mejores manos',
    subtitle:
      'Mecánica profesional, recambios de calidad y accesorios seleccionados. Visítanos en tienda o consúltanos por WhatsApp.',
  },
} as const

export const STATIC_SITE_SETTINGS: SiteSettings = {
  hero_image_url: '/images/hero.svg',
  logo_url: '',
  cta_image_url: '/images/cta.svg',
  catalog_banner_url: '/images/hero.svg',
  about_image_url: '/images/workshop.svg',
  service_image_mechanics: '/images/services/mechanics.svg',
  service_image_tyres: '/images/services/tyres.svg',
  service_image_electric: '/images/services/electric.svg',
  service_image_itv: '/images/services/itv.svg',
  color_theme: 'classic',
}

export const STATIC_CATEGORIES: Category[] = [
  {
    id: '00000000-0000-4000-8000-000000000000',
    name: 'Motos',
    slug: 'motos',
    image_url: '/images/categories/motos.svg',
    created_at: TS,
    updated_at: TS,
  },
  {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Accesorios',
    slug: 'accesorios',
    image_url: '/images/categories/accesorios.svg',
    created_at: TS,
    updated_at: TS,
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Recambios',
    slug: 'recambios',
    image_url: '/images/categories/recambios.svg',
    created_at: TS,
    updated_at: TS,
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    name: 'Equipamiento',
    slug: 'equipamiento',
    image_url: '/images/categories/equipamiento.svg',
    created_at: TS,
    updated_at: TS,
  },
  {
    id: '00000000-0000-4000-8000-000000000004',
    name: 'Neumáticos',
    slug: 'neumaticos',
    image_url: '/images/categories/neumaticos.svg',
    created_at: TS,
    updated_at: TS,
  },
]

const categoryById = Object.fromEntries(
  STATIC_CATEGORIES.map((category) => [category.id, category])
) as Record<string, Category>

function article(
  id: string,
  title: string,
  description: string,
  price: number,
  categoryId: string,
  imageUrl: string,
  onSale = false
): ArticleWithCategory {
  const category = categoryById[categoryId]
  return {
    id,
    title,
    description,
    price,
    category_id: categoryId,
    on_sale: onSale,
    image_url: imageUrl,
    created_at: TS,
    updated_at: TS,
    categories: category
      ? { id: category.id, name: category.name, slug: category.slug }
      : null,
  }
}

export const STATIC_ARTICLES: ArticleWithCategory[] = [
  article(
    '00000000-0000-4000-8000-000000000201',
    'TRRS One RR 300',
    'Concesionario oficial TRRS. Consulta disponibilidad, preparación y financiación por WhatsApp.',
    9290,
    '00000000-0000-4000-8000-000000000000',
    '/images/motos/trrs-one.svg'
  ),
  article(
    '00000000-0000-4000-8000-000000000202',
    'BETA RR 300 2T',
    'Concesionario oficial BETA. Stock y equivalencias de modelo a confirmar en tienda.',
    9790,
    '00000000-0000-4000-8000-000000000000',
    '/images/motos/beta-rr.svg',
    true
  ),
  article(
    '00000000-0000-4000-8000-000000000105',
    'Soporte móvil y USB',
    'Accesorios de manillar. Confirmamos compatibilidad para tu modelo.',
    29,
    '00000000-0000-4000-8000-000000000001',
    '/images/catalog/mount.svg'
  ),
  article(
    '00000000-0000-4000-8000-000000000101',
    'Casco integral',
    'Consulta disponibilidad y tallas en tienda o por WhatsApp.',
    189,
    '00000000-0000-4000-8000-000000000003',
    '/images/catalog/helmet.svg'
  ),
  article(
    '00000000-0000-4000-8000-000000000102',
    'Chaqueta touring',
    'Equipamiento de carretera. Pregúntanos por tallas y stock.',
    249,
    '00000000-0000-4000-8000-000000000003',
    '/images/catalog/jacket.svg',
    true
  ),
  article(
    '00000000-0000-4000-8000-000000000103',
    'Kit de recambios básicos',
    'Filtros y consumibles habituales. Confirmamos equivalencia para tu modelo.',
    45,
    '00000000-0000-4000-8000-000000000002',
    '/images/catalog/parts.svg'
  ),
  article(
    '00000000-0000-4000-8000-000000000104',
    'Par de neumáticos',
    'Montaje y equilibrado en taller. Consulta medidas disponibles.',
    160,
    '00000000-0000-4000-8000-000000000004',
    '/images/catalog/tyres.svg'
  ),
]
