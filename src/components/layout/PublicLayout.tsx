import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { ScrollToHash } from '@/components/ScrollToHash'
import { PublicPageSeo } from '@/components/seo/PublicPageSeo'
import { LocalBusinessJsonLd } from '@/components/seo/LocalBusinessJsonLd'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToHash />
      <PublicPageSeo />
      <LocalBusinessJsonLd />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
