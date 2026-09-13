import { useEffect, useState, type ReactNode } from 'react'
import { LOCAL_PLACEHOLDER_SRC } from '@/data/staticData'
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
      <img
        src={LOCAL_PLACEHOLDER_SRC}
        alt={alt}
        className={cn('size-full object-contain bg-muted p-6', className, fallbackClassName)}
        onError={(event) => {
          event.currentTarget.style.visibility = 'hidden'
        }}
      />
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
