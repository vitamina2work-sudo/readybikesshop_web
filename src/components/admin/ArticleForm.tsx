import { useState, type FormEvent } from 'react'
import type { Category } from '@/types/database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { uploadImage } from '@/lib/supabase'
import { toast } from 'sonner'

export interface ArticleFormData {
  title: string
  description: string
  price: string
  category_id: string
  on_sale: boolean
  image_url: string
}

interface ArticleFormProps {
  categories: Category[]
  initial?: Partial<ArticleFormData>
  onSubmit: (data: ArticleFormData) => Promise<void>
  onCancel: () => void
}

export function ArticleForm({ categories, initial, onSubmit, onCancel }: ArticleFormProps) {
  const [form, setForm] = useState<ArticleFormData>({
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    price: initial?.price ?? '',
    category_id: initial?.category_id ?? '',
    on_sale: initial?.on_sale ?? false,
    image_url: initial?.image_url ?? '',
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const update = (partial: Partial<ArticleFormData>) =>
    setForm((prev) => ({ ...prev, ...partial }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.price) {
      toast.error('Título y precio son obligatorios')
      return
    }

    setSaving(true)
    try {
      await onSubmit(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título *</Label>
        <Input
          id="title"
          value={form.title}
          onChange={(e) => update({ title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => update({ description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="price">Precio (€) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => update({ price: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Categoría</Label>
          <Select
            value={form.category_id || 'none'}
            onValueChange={(v) => update({ category_id: v === 'none' ? '' : v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sin categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin categoría</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="on_sale"
          checked={form.on_sale}
          onCheckedChange={(checked) => update({ on_sale: checked })}
        />
        <Label htmlFor="on_sale">En oferta</Label>
      </div>

      <ImageUpload
        label="Imagen del artículo"
        aspect="wide"
        value={form.image_url}
        onChange={(url) => update({ image_url: url })}
        onUpload={async (file) => {
          setUploading(true)
          try {
            return await uploadImage(file, 'articles')
          } catch {
            toast.error('Error al subir la imagen')
            throw new Error('upload failed')
          } finally {
            setUploading(false)
          }
        }}
      />

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={saving || uploading}>
          {saving ? 'Guardando…' : 'Guardar'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  )
}
