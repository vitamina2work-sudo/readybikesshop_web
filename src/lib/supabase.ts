import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase env vars missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  )
}

export const supabase = createClient<Database>(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-key'
)

if (import.meta.env.DEV) {
  console.info('[Supabase] URL:', supabaseUrl ?? 'MISSING')
}

export const STORAGE_BUCKET = 'products'
export const MAX_IMAGE_SIZE_MB = 20
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

export type StorageFolder = 'articles' | 'categories' | 'site'

export async function uploadImage(file: File, folder: StorageFolder = 'articles'): Promise<string> {
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error(
      `La imagen pesa ${(file.size / 1024 / 1024).toFixed(1)} MB. Máximo ${MAX_IMAGE_SIZE_MB} MB. Comprímela antes de subir.`
    )
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const fileName = `${crypto.randomUUID()}.${ext}`
  const filePath = `${folder}/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, { upsert: false })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}

/** @deprecated Use uploadImage(file, 'articles') */
export async function uploadProductImage(file: File): Promise<string> {
  return uploadImage(file, 'articles')
}

export async function deleteProductImage(imageUrl: string): Promise<void> {
  const marker = `/storage/v1/object/public/${STORAGE_BUCKET}/`
  const idx = imageUrl.indexOf(marker)
  if (idx === -1) return

  const filePath = imageUrl.slice(idx + marker.length)
  await supabase.storage.from(STORAGE_BUCKET).remove([filePath])
}
