export const siteConfig = {
  name: import.meta.env.VITE_SITE_NAME ?? 'Ready Bikes Shop',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER ?? '34600000000',
  address: 'Ctra. de Sabadell, 26, 08211 Castellar del Vallès, Barcelona',
  phone: '937 14 26 90',
  email: 'info@readybikes.es',
  nav: [
    { key: 'home', href: '/' },
    { key: 'catalog', href: '/catalogo' },
    { key: 'workshop', href: '/#servicios' },
    { key: 'contact', href: '/#contacto' },
  ],
  services: [
    { key: 'mechanics', icon: 'Wrench' },
    { key: 'tyres', icon: 'CircleDot' },
    { key: 'electric', icon: 'Zap' },
    { key: 'itv', icon: 'ClipboardCheck' },
  ],
} as const
