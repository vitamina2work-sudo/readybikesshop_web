import { USE_LOCAL_MOCK } from '@/config/dataSource'
import { supabase } from '@/lib/supabase'
import { safeQuery } from '@/lib/safeSupabase'
import { STATIC_ARTICLES, STATIC_CATEGORIES } from '@/data/staticData'
import type { ArticleWithCategory, Category } from '@/types/database'

export async function fetchPublicCategories(): Promise<Category[]> {
  if (USE_LOCAL_MOCK) return STATIC_CATEGORIES

  const data = await safeQuery(supabase.from('categories').select('*').order('name'))
  return data ?? STATIC_CATEGORIES
}

export async function fetchPublicArticles(): Promise<ArticleWithCategory[]> {
  if (USE_LOCAL_MOCK) return STATIC_ARTICLES

  const data = await safeQuery(
    supabase
      .from('articles')
      .select('*, categories(id, name, slug)')
      .order('created_at', { ascending: false })
  )

  if (!data) return STATIC_ARTICLES
  return data as ArticleWithCategory[]
}
