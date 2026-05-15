import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MarketingAtmosphere } from '@/components/marketing/MarketingAtmosphere'
import { getBlogPostBySlug } from '@/lib/blog/queries'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return { title: 'Not found — Blog' }
  return {
    title: `${post.title} — Blog`,
    description: post.excerpt,
  }
}

function ArticleBody({ content }: { content: string }) {
  const blocks = content
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean)

  return (
    <div className="space-y-5 font-sans text-base leading-[1.75] text-[color-mix(in_srgb,var(--foreground)_78%,var(--lavender))] md:text-[17px]">
      {blocks.map((block, i) => (
        <p key={i} className="whitespace-pre-wrap">
          {block}
        </p>
      ))}
    </div>
  )
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()

  const dateLabel = post.publishedAt
    ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(post.publishedAt))
    : null

  return (
    <article className="cin-section relative overflow-hidden">
      <MarketingAtmosphere tone="light" />

      <div className="cin-container cin-space pt-28 md:pt-32">
        <Link
          href="/blog"
          className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)] transition-colors hover:text-[var(--coral)]"
        >
          ← Blog
        </Link>

        <header className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-[color-mix(in_srgb,var(--coral)_12%,transparent)] px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--coral-dark)]">
              {post.category}
            </span>
            {post.featured ? (
              <span className="rounded-full bg-[color-mix(in_srgb,var(--blue)_12%,transparent)] px-3 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--blue)]">
                Featured
              </span>
            ) : null}
            {dateLabel ? (
              <span className="font-mono text-[11px] tracking-[0.14em] text-[var(--lavender)]">{dateLabel}</span>
            ) : null}
            <span className="font-mono text-[11px] tracking-[0.14em] text-[var(--lavender)]">{post.readingTime} min read</span>
          </div>
          <h1 className="cin-headline mt-6 text-[clamp(2.2rem,6vw,3.5rem)] font-black tracking-tight text-[var(--foreground)]">{post.title}</h1>
          <p className="cin-body mt-6 text-lg text-[color-mix(in_srgb,var(--foreground)_58%,var(--lavender))]">{post.excerpt}</p>
        </header>

        {post.coverImage ? (
          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface-secondary)] shadow-[0_28px_90px_rgba(0,0,0,0.08)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- CMS URL */}
            <img src={post.coverImage} alt="" className="aspect-[21/9] w-full object-cover object-center" />
          </div>
        ) : null}

        <div className="mx-auto mt-14 max-w-3xl">
          <ArticleBody content={post.content} />
        </div>
      </div>
    </article>
  )
}
