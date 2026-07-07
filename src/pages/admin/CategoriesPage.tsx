import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types/database'
import { CategoryForm, type CategoryFormData } from '@/components/admin/CategoryForm'
import { CategoryList } from '@/components/admin/CategoryList'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)

  const load = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data) setCategories(data)
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (data: CategoryFormData) => {
    const payload = {
      name: data.name.trim(),
      slug: data.slug.trim(),
      image_url: data.image_url || null,
    }

    if (editing) {
      const { error } = await supabase.from('categories').update(payload).eq('id', editing.id)
      if (error) {
        toast.error('Error al actualizar la categoría')
        return
      }
      toast.success('Categoría actualizada')
    } else {
      const { error } = await supabase.from('categories').insert(payload)
      if (error) {
        toast.error('Error al crear la categoría')
        return
      }
      toast.success('Categoría creada')
    }

    setDialogOpen(false)
    setEditing(null)
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría?')) return

    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) {
      toast.error('Error al eliminar')
      return
    }
    toast.success('Categoría eliminada')
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categorías</h1>
          <p className="mt-1 text-sm text-muted-foreground">Clasificaciones del escaparate</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="size-4" />
          Nueva categoría
        </Button>
      </div>

      <div className="mt-6">
        <CategoryList
          categories={categories}
          onEdit={(cat) => {
            setEditing(cat)
            setDialogOpen(true)
          }}
          onDelete={handleDelete}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar categoría' : 'Nueva categoría'}</DialogTitle>
          </DialogHeader>
          <CategoryForm
            key={editing?.id ?? 'new'}
            initial={
              editing
                ? {
                    name: editing.name,
                    slug: editing.slug,
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
