'use client'

import Link from 'next/link'

import { useScrollReveal } from '@/hooks/useScrollReveal'

export type HomeBlogTeaser = {
  slug: string
  title: string
  excerpt: string
  category: string
  readingTime: number
}

/**
 * Home-only blog teaser — dark editorial rail, numbered rows.
 * Intentionally different from the `/blog` marketing hero.
 */
export default function HomeBlogSection({ posts }: { posts: HomeBlogTeaser[] }) {
  const sectionRef = useScrollReveal<HTMLElement>({ threshold: 0.12 })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden cin-section"
      style={{ background: 'var(--graphite)' }}
    >
      <div className="pointer-events-none absolute inset-0 intro-grain" style={{ opacity: 0.18 }} aria-hidden />

      <div
        className="pointer-events-none absolute -top-[20%] right-[-5%] h-[55%] w-[45%] rounded-full blur-[100px] opacity-35"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(255,122,89,0.35) 0%, transparent 68%)',
        }}
        aria-hidden
      />

      <div className="cin-container relative z-10 py-20 md:py-28">
        <div className="flex flex-col gap-6 border-b border-white/10 pb-10 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="min-w-0">
            <div
              className="cin-kicker reveal"
              style={{ '--reveal-delay': '0s', color: 'rgba(255,255,255,0.32)' } as React.CSSProperties}
            >
              Journal
            </div>
            <h2
              className="cin-headline reveal mt-5 max-w-xl"
              style={
                {
                  fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
                  color: 'white',
                  lineHeight: 1.05,
                  '--reveal-delay': '0.06s',
                } as React.CSSProperties
              }
            >
              Short reads,
              <br />
              <span style={{ color: 'var(--coral)' }}> long intent</span>.
            </h2>
            <p
              className="reveal mt-5 max-w-md font-sans text-sm leading-relaxed md:text-base"
              style={{ color: 'rgba(255,255,255,0.42)', '--reveal-delay': '0.12s' } as React.CSSProperties}
            >
              A running list — not the full shelf. Open the journal for the complete index.
            </p>
          </div>

          <Link
            href="/blog"
            className="reveal inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/14 px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.14em] text-white/75 transition-[border-color,color,transform] duration-500 ease-[var(--ease-out-expo)] hover:border-[color-mix(in_srgb,var(--coral)_45%,transparent)] hover:text-white md:self-end"
            style={{ '--reveal-delay': '0.14s' } as React.CSSProperties}
          >
            All writing <span style={{ color: 'var(--coral)' }}>→</span>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="reveal pt-14" style={{ '--reveal-delay': '0.18s' } as React.CSSProperties}>
            <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.38)' }}>
              Nothing published yet. When you ship posts from the panel, the three newest ones land here.
            </p>
            <Link
              href="/blog"
              className="mt-6 inline-flex font-display text-sm font-semibold text-white/70 transition-colors hover:text-[var(--coral)]"
            >
              See the journal layout →
            </Link>
          </div>
        ) : (
          <ul className="reveal divide-y divide-white/[0.08]" style={{ '--reveal-delay': '0.18s' } as React.CSSProperties}>
            {posts.map((post, i) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-4 py-8 transition-colors md:flex-row md:items-start md:gap-10 md:py-10"
                >
                  <span
                    className="font-mono text-[11px] font-medium tabular-nums tracking-[0.2em] text-white/25 transition-colors duration-500 group-hover:text-[var(--coral)] md:w-14 md:shrink-0 md:pt-1"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0 flex-1 border-l border-white/[0.12] pl-6 transition-[border-color] duration-500 ease-[var(--ease-out-expo)] group-hover:border-[var(--coral)] md:pl-10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.35)' }}>
                        {post.category}
                      </span>
                      <span className="font-mono text-[10px] tracking-[0.12em]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                        {post.readingTime} min
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-xl font-bold tracking-tight text-white transition-colors duration-500 group-hover:text-[var(--coral)] md:text-2xl">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 max-w-2xl font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {post.excerpt}
                    </p>
                  </div>
                  <span
                    className="font-mono text-xs text-white/30 transition-[transform,color] duration-500 group-hover:translate-x-1 group-hover:text-[var(--coral)] md:ml-auto md:shrink-0 md:pt-1"
                    aria-hidden
                  >
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
