import Hero from '@/components/home/Hero'
import WorkPreview from '@/components/home/WorkPreview'
import Marquee from '@/components/home/Marquee'
import AboutStrip from '@/components/home/AboutStrip'
import ServicesStrip from '@/components/home/ServicesStrip'
import CTASection from '@/components/home/CTASection'
import IntroGate from '@/components/experience/IntroGate'
import { getProjects } from '@/lib/projects'

export const revalidate = 0

export default async function HomePage() {
  const all = await getProjects()
  const featured = all.filter((p) => p.featured)

  return (
    <IntroGate>
      {/* 1 — Light: Hero */}
      <Hero />

      {/* 2 — Dark: Work Preview */}
      <WorkPreview featured={featured} totalCount={all.length} />

      {/* Marquee transition */}
      <Marquee />

      {/* 3 — Light: About */}
      <AboutStrip />

      {/* 4 — Dark: Services */}
      <ServicesStrip />

      {/* Marquee transition */}
      <Marquee />

      {/* 5 — Light: CTA */}
      <CTASection />
    </IntroGate>
  )
}
