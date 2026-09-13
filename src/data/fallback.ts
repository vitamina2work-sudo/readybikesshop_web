import type { ArticleWithCategory, Category } from '@/types/database'

const FALLBACK_TS = '2026-01-01T00:00:00.000Z'

/** Stable IDs so catalog filters (`?categoria=`) keep working offline. */
export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    name: 'Accesorios',
    slug: 'accesorios',
    image_url: null,
    created_at: FALLBACK_TS,
    updated_at: FALLBACK_TS,
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    name: 'Recambios',
    slug: 'recambios',
    image_url: null,
    created_at: FALLBACK_TS,
    updated_at: FALLBACK_TS,
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    name: 'Equipamiento',
    slug: 'equipamiento',
    image_url: null,
    created_at: FALLBACK_TS,
    updated_at: FALLBACK_TS,
  },
  {
    id: '00000000-0000-4000-8000-000000000004',
    name: 'Neumáticos',
    slug: 'neumaticos',
    image_url: null,
    created_at: FALLBACK_TS,
    updated_at: FALLBACK_TS,
  },
]

const categoryById = Object.fromEntries(
  FALLBACK_CATEGORIES.map((category) => [category.id, category])
) as Record<string, Category>

function fallbackArticle(
  id: string,
  title: string,
  description: string,
  price: number,
  categoryId: string,
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
    image_url: null,
    created_at: FALLBACK_TS,
    updated_at: FALLBACK_TS,
    categories: category
      ? { id: category.id, name: category.name, slug: category.slug }
      : null,
  }
}

export const FALLBACK_ARTICLES: ArticleWithCategory[] = [
  fallbackArticle(
    '00000000-0000-4000-8000-000000000105',
    'Soporte móvil y USB',
    'Accesorios de manillar. Confirmamos compatibilidad para tu modelo.',
    29,
    '00000000-0000-4000-8000-000000000001'
  ),
  fallbackArticle(
    '00000000-0000-4000-8000-000000000101',
    'Casco integral',
    'Consulta disponibilidad y tallas en tienda o por WhatsApp.',
    189,
    '00000000-0000-4000-8000-000000000003'
  ),
  fallbackArticle(
    '00000000-0000-4000-8000-000000000102',
    'Chaqueta touring',
    'Equipamiento de carretera. Pregúntanos por tallas y stock.',
    249,
    '00000000-0000-4000-8000-000000000003',
    true
  ),
  fallbackArticle(
    '00000000-0000-4000-8000-000000000103',
    'Kit de recambios básicos',
    'Filtros y consumibles habituales. Confirmamos equivalencia para tu modelo.',
    45,
    '00000000-0000-4000-8000-000000000002'
  ),
  fallbackArticle(
    '00000000-0000-4000-8000-000000000104',
    'Par de neumáticos',
    'Montaje y equilibrado en taller. Consulta medidas disponibles.',
    160,
    '00000000-0000-4000-8000-000000000004'
  ),
]
