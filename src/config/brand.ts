/** Static brand assets (public/). Admin can override header logo via site_settings.logo_url. */
export const brandAssets = {
  logoHorizontal: '/brand/logo-horizontal.png',
  logoEmblem: '/brand/logo-emblem.png',
} as const

/** Official dealership brands (logos from manufacturer sites, stored in public/brand/dealers/). */
export const officialDealers = [
  {
    id: 'trrs',
    name: 'TRRS',
    logo: '/brand/dealers/trrs-light.svg',
    website: 'https://trsmotorcycles.com/',
  },
  {
    id: 'beta',
    name: 'BETA',
    logo: '/brand/dealers/beta.png',
    website: 'https://www.betamotor.com/',
  },
] as const
