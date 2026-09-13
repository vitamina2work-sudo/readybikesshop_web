import { useEffect, useState, type ReactNode } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

type SafeImageProps = {
  src?: string | null
  alt: string
  className?: string
  fallbackClassName?: string
  /** Rendered when `src` is empty or the remote image fails to load. */
  fallback?: ReactNode
  /** Only rendered while the remote image is visible. */
  children?: ReactNode
  loading?: 'lazy' | 'eager'
}

export function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  fallback,
  children,
  loading = 'lazy',
}: SafeImageProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  const showImage = Boolean(src) && !failed

  if (!showImage) {
    if (fallback) return <>{fallback}</>
    return (
      <div
        className={cn(
          'flex size-full items-center justify-center bg-muted text-muted-foreground',
          fallbackClassName
        )}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="size-8 opacity-40" aria-hidden />
      </div>
    )
  }

  return (
    <>
      <img
        src={src ?? ''}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        onError={() => setFailed(true)}
      />
      {children}
    </>
  )
}
