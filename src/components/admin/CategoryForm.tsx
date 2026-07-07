import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { slugify } from '@/lib/utils'
import { ImageUpload } from '@/components/admin/ImageUpload'
import { uploadImage } from '@/lib/supabase'
import { toast } from 'sonner'

export interface CategoryFormData {
  name: string
  slug: string
  image_url: string
}

interface CategoryFormProps {
  initial?: Partial<CategoryFormData>
  onSubmit: (data: CategoryFormData) => Promise<void>
  onCancel: () => void
}

export function CategoryForm({ initial, onSubmit, onCancel }: CategoryFormProps) {
  const [form, setForm] = useState<CategoryFormData>({
    name: initial?.name ?? '',
    slug: initial?.slug ?? '',
    image_url: initial?.image_url ?? '',
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [slugManual, setSlugManual] = useState(!!initial?.slug)

  const update = (partial: Partial<CategoryFormData>) =>
    setForm((prev) => ({ ...prev, ...partial }))

  const handleNameChange = (name: string) => {
    update({ name, ...(!slugManual ? { slug: slugify(name) } : {}) })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error('Nombre y slug son obligatorios')
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
        <Label htmlFor="cat-name">Nombre *</Label>
        <Input
          id="cat-name"
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cat-slug">Slug *</Label>
        <Input
          id="cat-slug"
          value={form.slug}
          onChange={(e) => {
            setSlugManual(true)
            update({ slug: slugify(e.target.value) })
          }}
          required
        />
      </div>

      <ImageUpload
        label="Imagen de categoría"
        hint="Se muestra en la home y en el escaparate"
        aspect="wide"
        value={form.image_url}
        onChange={(url) => update({ image_url: url })}
        onUpload={async (file) => {
          setUploading(true)
          try {
            return await uploadImage(file, 'categories')
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
