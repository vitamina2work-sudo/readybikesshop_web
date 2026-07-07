import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import type { ArticleWithCategory } from '@/types/database'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPriceLocalized } from '@/lib/whatsapp'
import { buildArticleWhatsAppMessage, buildWhatsAppUrl } from '@/lib/whatsapp'

interface ProductCardProps {
  article: ArticleWithCategory
}

export function ProductCard({ article }: ProductCardProps) {
  const { t, i18n } = useTranslation()
  const whatsappUrl = buildWhatsAppUrl(
    buildArticleWhatsAppMessage(t, article.title, article.price, i18n.language)
  )

  return (
    <Card className="overflow-hidden pt-0 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group border-0 shadow-md ring-1 ring-border/50">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {article.image_url ? (
          <img
            src={article.image_url}
            alt={article.title}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-muted-foreground text-sm">
            {t('catalog.noImage')}
          </div>
        )}
        {article.on_sale && (
          <Badge variant="sale" className="absolute top-3 left-3">
            {t('catalog.onSale')}
          </Badge>
        )}
      </div>

      <CardHeader className="pb-2">
        {article.categories && (
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            {article.categories.name}
          </p>
        )}
        <CardTitle className="text-base line-clamp-2">{article.title}</CardTitle>
      </CardHeader>

      <CardContent className="pb-2">
        {article.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{article.description}</p>
        )}
        <p className="mt-2 text-xl font-bold text-primary">
          {formatPriceLocalized(article.price, i18n.language)}
        </p>
      </CardContent>

      <CardFooter>
        <Button variant="whatsapp" className="w-full" asChild>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" />
            {t('catalog.whatsapp')}
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
