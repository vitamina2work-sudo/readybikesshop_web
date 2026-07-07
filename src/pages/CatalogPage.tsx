import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/lib/supabase'
import type { ArticleWithCategory, Category } from '@/types/database'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import {
  CatalogFilters,
  type CatalogFiltersState,
} from '@/components/catalog/CatalogFilters'
import { ProductGrid } from '@/components/catalog/ProductGrid'

const defaultFilters: CatalogFiltersState = {
  categoryId: 'all',
  minPrice: '',
  maxPrice: '',
  onSaleOnly: false,
}

export function CatalogPage() {
  const { t } = useTranslation()
  const { settings } = useSiteSettings()
  const [searchParams] = useSearchParams()
  const [articles, setArticles] = useState<ArticleWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [filters, setFilters] = useState<CatalogFiltersState>(defaultFilters)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const slug = searchParams.get('categoria')
    if (!slug || categories.length === 0) return
    const cat = categories.find((c) => c.slug === slug)
    if (cat) setFilters((f) => ({ ...f, categoryId: cat.id }))
  }, [searchParams, categories])

  useEffect(() => {
    async function load() {
      setLoading(true)

      const [articlesRes, categoriesRes] = await Promise.all([
        supabase
          .from('articles')
          .select('*, categories(id, name, slug)')
          .order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('name'),
      ])

      if (articlesRes.data) setArticles(articlesRes.data as ArticleWithCategory[])
      if (categoriesRes.data) setCategories(categoriesRes.data)
      setLoading(false)
    }

    load()
  }, [])

  const priceBounds = useMemo(() => {
    if (articles.length === 0) return { min: 0, max: 500 }
    const prices = articles.map((a) => a.price)
    const min = Math.floor(Math.min(...prices))
    const max = Math.ceil(Math.max(...prices))
    return min === max ? { min: Math.max(0, min - 10), max: max + 10 } : { min, max }
  }, [articles])

  const filtered = useMemo(() => {
    return articles.filter((article) => {
      if (filters.categoryId !== 'all' && article.category_id !== filters.categoryId) {
        return false
      }
      if (filters.minPrice !== '' && article.price < parseFloat(filters.minPrice)) {
        return false
      }
      if (filters.maxPrice !== '' && article.price > parseFloat(filters.maxPrice)) {
        return false
      }
      if (filters.onSaleOnly && !article.on_sale) {
        return false
      }
      return true
    })
  }, [articles, filters])

  return (
    <div>
      {settings.catalog_banner_url ? (
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <img
            src={settings.catalog_banner_url}
            alt=""
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('catalog.title')}</h1>
            <p className="mt-2 text-muted-foreground max-w-xl">{t('catalog.subtitle')}</p>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">{t('catalog.title')}</h1>
            <p className="mt-2 text-muted-foreground">{t('catalog.subtitle')}</p>
          </div>
        </div>
      )}

    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside>
          <CatalogFilters
            categories={categories}
            filters={filters}
            priceBounds={priceBounds}
            onChange={setFilters}
          />
        </aside>
        <div>
          <p className="mb-4 text-sm text-muted-foreground">
            {loading
              ? t('common.loading')
              : t('catalog.count', { count: filtered.length })}
          </p>
          <ProductGrid articles={filtered} loading={loading} />
        </div>
      </div>
    </div>
    </div>
  )
}
