import { useEffect, useMemo, useState } from 'react'
import { brandAssets } from '@/config/brand'
import { siteConfig } from '@/config/site'
import { LOCAL_PLACEHOLDER_SRC } from '@/data/staticData'
import { IMAGE_PRESETS, optimizeStorageImageUrl } from '@/lib/storageImage'
import { cn } from '@/lib/utils'

type BrandLogoVariant = 'horizontal' | 'emblem'

type BrandLogoProps = {
  variant?: BrandLogoVariant
  className?: string
  /** Custom URL from admin (header icon slot). Falls back to static emblem/horizontal. */
  src?: string
  loading?: 'lazy' | 'eager'
}

const variantDefaults: Record<BrandLogoVariant, { src: string; className: string }> = {
  horizontal: {
    src: brandAssets.logoHorizontal,
    className: 'h-12 w-auto max-w-[min(100%,280px)] object-contain object-left sm:h-14',
  },
  emblem: {
    src: brandAssets.logoEmblem,
    className: 'size-12 object-contain sm:size-14',
  },
}

export function BrandLogo({
  variant = 'horizontal',
  className,
  src,
  loading = 'lazy',
}: BrandLogoProps) {
  const defaults = variantDefaults[variant]
  const [remoteFailed, setRemoteFailed] = useState(false)
  const [useOriginal, setUseOriginal] = useState(false)
  const usingRemote = Boolean(src) && !remoteFailed

  useEffect(() => {
    setRemoteFailed(false)
    setUseOriginal(false)
  }, [src])

  const optimizedRemote = useMemo(
    () => (src ? optimizeStorageImageUrl(src, IMAGE_PRESETS.logo) : ''),
    [src]
  )

  const remoteSrc = useOriginal ? src : optimizedRemote || src
  const canRetryOriginal = Boolean(src) && optimizedRemote !== src && !useOriginal

  return (
    <img
      src={usingRemote && remoteSrc ? remoteSrc : defaults.src}
      alt={siteConfig.name}
      className={cn(defaults.className, className)}
      loading={loading}
      decoding="async"
      onError={(event) => {
        if (usingRemote && canRetryOriginal) {
          setUseOriginal(true)
          return
        }
        if (usingRemote) {
          setRemoteFailed(true)
          return
        }
        if (event.currentTarget.src !== LOCAL_PLACEHOLDER_SRC) {
          event.currentTarget.src = LOCAL_PLACEHOLDER_SRC
        }
      }}
    />
  )
}
