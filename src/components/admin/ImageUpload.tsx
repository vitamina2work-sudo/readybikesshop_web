import { useRef, useState } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onUpload: (file: File) => Promise<string>
  label?: string
  hint?: string
  aspect?: 'square' | 'video' | 'wide' | 'banner'
  className?: string
}

const aspectClass = {
  square: 'aspect-square max-w-[200px]',
  video: 'aspect-video max-w-xs',
  wide: 'aspect-[4/3] max-w-sm',
  banner: 'aspect-[21/9] w-full max-w-2xl',
}

export function ImageUpload({
  value,
  onChange,
  onUpload,
  label,
  hint,
  aspect = 'wide',
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File) => {
    setUploading(true)
    try {
      const url = await onUpload(file)
      onChange(url)
      toast.success('Imagen subida')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al subir'
      const hint =
        message.includes('403') || message.toLowerCase().includes('policy')
          ? ' — Ejecuta 005_fix_storage_policies.sql en Supabase y confirma que tu usuario es admin.'
          : message.toLowerCase().includes('maximum allowed size') ||
              message.includes('MB')
            ? ' — Usa JPG/WebP o comprime la imagen. Ejecuta 006_increase_storage_limit.sql en Supabase.'
            : ''
      toast.error(`No se pudo subir la imagen${hint}`, { description: message })
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && <p className="text-sm font-medium">{label}</p>}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) void handleFile(file)
        }}
      />

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Vista previa"
            className={cn(
              'rounded-xl object-cover border shadow-sm w-full',
              aspectClass[aspect]
            )}
          />
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="size-8"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ImagePlus className="size-4" />
              )}
            </Button>
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="size-8"
              onClick={() => onChange('')}
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-muted/30 px-4 py-8 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary w-full',
            aspectClass[aspect]
          )}
        >
          {uploading ? (
            <Loader2 className="size-8 animate-spin" />
          ) : (
            <ImagePlus className="size-8" />
          )}
          <span className="text-xs font-medium">
            {uploading ? 'Subiendo…' : 'Clic para subir imagen'}
          </span>
        </button>
      )}
    </div>
  )
}
