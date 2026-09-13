import { supabase } from '@/lib/supabase'
import { safeQuery } from '@/lib/safeSupabase'
import { FALLBACK_ARTICLES, FALLBACK_CATEGORIES } from '@/data/fallback'
import type { ArticleWithCategory, Category } from '@/types/database'

export async function fetchPublicCategories(): Promise<Category[]> {
  const data = await safeQuery(supabase.from('categories').select('*').order('name'))
  return data ?? FALLBACK_CATEGORIES
}

export async function fetchPublicArticles(): Promise<ArticleWithCategory[]> {
  const data = await safeQuery(
    supabase
      .from('articles')
      .select('*, categories(id, name, slug)')
      .order('created_at', { ascending: false })
  )

  if (!data) return FALLBACK_ARTICLES
  return data as ArticleWithCategory[]
}
