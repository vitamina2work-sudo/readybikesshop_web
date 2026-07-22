export const siteConfig = {
  name: import.meta.env.VITE_SITE_NAME ?? 'Ready Motos',
  url: import.meta.env.VITE_SITE_URL ?? 'https://readybikesshop.vitamina2work.com',
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER ?? '34600000000',
  address: 'Ctra. de Sabadell, 26, 08211 Castellar del Vallès, Barcelona',
  phone: '937 14 26 90',
  email: 'info@readybikes.es',
  geo: {
    region: 'ES-B',
    placename: 'Castellar del Vallès',
    latitude: 41.6097,
    longitude: 2.0874,
  },
  openingHours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'],
      opens: '08:00',
      closes: '19:00',
    },
    {
      days: ['Friday'],
      opens: '08:00',
      closes: '16:00',
    },
  ],
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
