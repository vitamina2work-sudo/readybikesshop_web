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
    className: 'h-9 w-auto max-w-[min(100%,220px)] object-contain object-left',
  },
  emblem: {
    src: brandAssets.logoEmblem,
    className: 'size-10 object-contain',
  },
}

export function BrandLogo({ variant = 'horizontal', className, src }: BrandLogoProps) {
  const defaults = variantDefaults[variant]

  return (
    <img
      src={src || defaults.src}
      alt={siteConfig.name}
      className={cn(defaults.className, className)}
      decoding="async"
    />
  )
}
