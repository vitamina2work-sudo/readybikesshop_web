import { Hero } from '@/components/home/Hero'
import { Services } from '@/components/home/Services'
import { CategoriesShowcase } from '@/components/home/CategoriesShowcase'
import { CtaSection } from '@/components/home/CtaSection'

export function HomePage() {
  return (
    <>
      <Hero />
      <CategoriesShowcase />
      <Services />
      <CtaSection />
    </>
  )
}
