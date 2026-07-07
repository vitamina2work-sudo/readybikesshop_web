import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { ArticleWithCategory, Category } from '@/types/database'
import { ArticleForm, type ArticleFormData } from '@/components/admin/ArticleForm'
import { ArticleList } from '@/components/admin/ArticleList'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleWithCategory[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ArticleWithCategory | null>(null)

  const load = async () => {
    const [articlesRes, categoriesRes] = await Promise.all([
      supabase
        .from('articles')
        .select('*, categories(id, name, slug)')
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ])

    if (articlesRes.data) setArticles(articlesRes.data as ArticleWithCategory[])
    if (categoriesRes.data) setCategories(categoriesRes.data)
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (data: ArticleFormData) => {
    const payload = {
      title: data.title.trim(),
      description: data.description.trim() || null,
      price: parseFloat(data.price),
      category_id: data.category_id || null,
      on_sale: data.on_sale,
      image_url: data.image_url || null,
    }

    if (editing) {
      const { error } = await supabase.from('articles').update(payload).eq('id', editing.id)
      if (error) {
        toast.error('Error al actualizar el artículo')
        return
      }
      toast.success('Artículo actualizado')
    } else {
      const { error } = await supabase.from('articles').insert(payload)
      if (error) {
        toast.error('Error al crear el artículo')
        return
      }
      toast.success('Artículo creado')
    }

    setDialogOpen(false)
    setEditing(null)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este artículo?')) return

    const { error } = await supabase.from('articles').delete().eq('id', id)
    if (error) {
      toast.error('Error al eliminar')
      return
    }
    toast.success('Artículo eliminado')
    load()
  }

  const openCreate = () => {
    setEditing(null)
    setDialogOpen(true)
  }

  const openEdit = (article: ArticleWithCategory) => {
    setEditing(article)
    setDialogOpen(true)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Artículos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestiona el escaparate</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4" />
          Nuevo artículo
        </Button>
      </div>

      <div className="mt-6">
        <ArticleList articles={articles} onEdit={openEdit} onDelete={handleDelete} />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar artículo' : 'Nuevo artículo'}</DialogTitle>
          </DialogHeader>
          <ArticleForm
            key={editing?.id ?? 'new'}
            categories={categories}
            initial={
              editing
                ? {
                    title: editing.title,
                    description: editing.description ?? '',
                    price: String(editing.price),
                    category_id: editing.category_id ?? '',
                    on_sale: editing.on_sale,
                    image_url: editing.image_url ?? '',
                  }
                : undefined
            }
            onSubmit={handleSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
