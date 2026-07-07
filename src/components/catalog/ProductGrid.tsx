import { useTranslation } from 'react-i18next'
import type { ArticleWithCategory } from '@/types/database'
import { ProductCard } from './ProductCard'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductGridProps {
  articles: ArticleWithCategory[]
  loading?: boolean
}

export function ProductGrid({ articles, loading }: ProductGridProps) {
  const { t } = useTranslation()

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[4/3] w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium">{t('catalog.emptyTitle')}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t('catalog.emptySubtitle')}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article) => (
        <ProductCard key={article.id} article={article} />
      ))}
    </div>
  )
}
