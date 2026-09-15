const SUPABASE_OBJECT_MARKER = '/storage/v1/object/public/'
const SUPABASE_RENDER_MARKER = '/storage/v1/render/image/public/'

export type StorageImageOptions = {
  width?: number
  height?: number
  /** 20–100. Defaults to 75. */
  quality?: number
  resize?: 'cover' | 'contain' | 'fill'
}

export function isSupabaseStorageUrl(url: string): boolean {
  return url.includes(SUPABASE_OBJECT_MARKER) || url.includes(SUPABASE_RENDER_MARKER)
}

/** Request a resized variant via Supabase Storage image transforms (render endpoint). */
export function optimizeStorageImageUrl(
  url: string,
  options: StorageImageOptions = {}
): string {
  if (!url || !isSupabaseStorageUrl(url)) return url

  let renderUrl = url
  if (url.includes(SUPABASE_OBJECT_MARKER)) {
    renderUrl = url.replace(SUPABASE_OBJECT_MARKER, SUPABASE_RENDER_MARKER)
  }

  const [base, existingQuery] = renderUrl.split('?')
  const params = new URLSearchParams(existingQuery ?? '')

  const { width, height, quality = 75, resize = 'cover' } = options
  if (width) params.set('width', String(Math.round(width)))
  if (height) params.set('height', String(Math.round(height)))
  params.set('quality', String(Math.min(100, Math.max(20, quality))))
  params.set('resize', resize)

  return `${base}?${params.toString()}`
}

/** Preset dimensions aligned with layout breakpoints (2× for retina where noted). */
export const IMAGE_PRESETS = {
  productCard: { width: 640, height: 480 },
  categoryCard: { width: 640, height: 480 },
  hero: { width: 1920, height: 1080, quality: 80 },
  catalogBanner: { width: 1280, height: 400, quality: 80 },
  about: { width: 960, height: 720 },
  serviceCard: { width: 480, height: 300 },
  cta: { width: 960, height: 720 },
  adminPreview: { width: 400, height: 300 },
  logo: { width: 256, height: 256, resize: 'contain' as const },
} satisfies Record<string, StorageImageOptions>
