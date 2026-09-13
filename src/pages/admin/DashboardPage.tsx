import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, Tags } from 'lucide-react'
import { fetchPublicArticles, fetchPublicCategories } from '@/lib/publicCatalog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function DashboardPage() {
  const [counts, setCounts] = useState({ articles: 0, categories: 0, onSale: 0 })

  useEffect(() => {
    async function load() {
      const [articles, categories] = await Promise.all([
        fetchPublicArticles(),
        fetchPublicCategories(),
      ])

      setCounts({
        articles: articles.length,
        categories: categories.length,
        onSale: articles.filter((article) => article.on_sale).length,
      })
    }

    load()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground text-sm">Resumen del escaparate</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Artículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{counts.articles}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Categorías
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{counts.categories}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              En oferta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{counts.onSale}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/admin/articulos">
            <Package className="size-4" />
            Gestionar artículos
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/admin/categorias">
            <Tags className="size-4" />
            Gestionar categorías
          </Link>
        </Button>
      </div>
    </div>
  )
}
