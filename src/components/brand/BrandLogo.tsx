import { useEffect, useState } from 'react'
import { brandAssets } from '@/config/brand'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'

type BrandLogoVariant = 'horizontal' | 'emblem'

type BrandLogoProps = {
  variant?: BrandLogoVariant
  className?: string
  /** Custom URL from admin (header icon slot). Falls back to static emblem/horizontal. */
  src?: string
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

export function BrandLogo({ variant = 'horizontal', className, src }: BrandLogoProps) {
  const defaults = variantDefaults[variant]
  const [remoteFailed, setRemoteFailed] = useState(false)
  const usingRemote = Boolean(src) && !remoteFailed

  useEffect(() => {
    setRemoteFailed(false)
  }, [src])

  return (
    <img
      src={usingRemote && src ? src : defaults.src}
      alt={siteConfig.name}
      className={cn(defaults.className, className)}
      decoding="async"
      onError={() => {
        if (usingRemote) setRemoteFailed(true)
      }}
    />
  )
}
