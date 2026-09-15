import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { LOCAL_PLACEHOLDER_SRC } from '@/data/staticData'
import {
  optimizeStorageImageUrl,
  type StorageImageOptions,
} from '@/lib/storageImage'
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
  /** Resize Supabase Storage URLs before fetch to reduce egress. */
  optimize?: StorageImageOptions | false
}

export function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  fallback,
  children,
  loading = 'lazy',
  optimize,
}: SafeImageProps) {
  const [failed, setFailed] = useState(false)
  const [useOriginal, setUseOriginal] = useState(false)

  useEffect(() => {
    setFailed(false)
    setUseOriginal(false)
  }, [src])

  const optimizedSrc = useMemo(() => {
    if (!src || optimize === false || !optimize) return src
    if (!optimize.width && !optimize.height) return src
    return optimizeStorageImageUrl(src, optimize)
  }, [src, optimize])

  const canRetryOriginal =
    Boolean(src) &&
    Boolean(optimizedSrc) &&
    optimizedSrc !== src &&
    !useOriginal

  const displaySrc = useOriginal ? src : optimizedSrc
  const showImage = Boolean(displaySrc) && !failed

  if (!showImage) {
    if (fallback) return <>{fallback}</>
    return (
      <img
        src={LOCAL_PLACEHOLDER_SRC}
        alt={alt}
        className={cn('size-full object-contain bg-muted p-6', className, fallbackClassName)}
        loading="lazy"
        decoding="async"
        onError={(event) => {
          event.currentTarget.style.visibility = 'hidden'
        }}
      />
    )
  }

  return (
    <>
      <img
        src={displaySrc ?? ''}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        onError={() => {
          if (canRetryOriginal) {
            setUseOriginal(true)
            return
          }
          setFailed(true)
        }}
      />
      {children}
    </>
  )
}
