import Hero from '@/components/home/Hero'
import WorkPreview from '@/components/home/WorkPreview'
import Marquee from '@/components/home/Marquee'
import AboutStrip from '@/components/home/AboutStrip'
import ServicesStrip from '@/components/home/ServicesStrip'
import CTASection from '@/components/home/CTASection'
import HomeBlogSection, { type HomeBlogTeaser } from '@/components/home/HomeBlogSection'
import IntroGate from '@/components/experience/IntroGate'
import { getPublishedBlogPosts } from '@/lib/blog/queries'
import type { BlogPostRow } from '@/lib/db/schema'
import { getProjects } from '@/lib/projects'

export const revalidate = 0

function orderHomeBlogTeasers(posts: BlogPostRow[], limit: number): HomeBlogTeaser[] {
  const featured = posts.filter((p) => p.featured)
  const rest = posts.filter((p) => !p.featured)
  return [...featured, ...rest].slice(0, limit).map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    category: p.category,
    readingTime: p.readingTime,
  }))
}

export default async function HomePage() {
  const all = await getProjects()
  const featured = all.filter((p) => p.featured)
  const blogTeasers = orderHomeBlogTeasers(await getPublishedBlogPosts(), 3)

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

      {/* 6 — Dark: Journal rail (home-only; not the /blog hero) */}
      <HomeBlogSection posts={blogTeasers} />
    </IntroGate>
  )
}
