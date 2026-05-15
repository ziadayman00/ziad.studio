import Link from 'next/link'

import BlogPagination from '@/components/blog/BlogPagination'
import { MarketingAtmosphere } from '@/components/marketing/MarketingAtmosphere'
import { blogListHref } from '@/lib/blog/blog-list-href'
import type { BlogPostRow } from '@/lib/db/schema'

const notes = [
  {
    title: 'Designing calm interfaces with cinematic pacing',
    tag: 'Interaction',
    dek: 'Why restraint reads as luxury — and how to choreograph attention without shouting.',
  },
  {
    title: 'How I structure Next.js projects for scale',
    tag: 'Engineering',
    dek: 'Boundaries between server data, client islands, and design tokens that survive growth.',
  },
  {
    title: 'Motion without noise: principles I follow',
    tag: 'Motion',
    dek: 'Curves, overlap, and exit intent — the small rules that keep animation from becoming decoration.',
  },
] as const

function formatPostDate(d: Date | null) {
  if (!d) return null
  try {
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(d)
  } catch {
    return null
  }
}

type BlogIndexProps = {
  posts: BlogPostRow[]
  total: number
  page: number
  pageSize: number
  category: string | null
  categories: string[]
}

export default function BlogIndex({ posts, total, page, pageSize, category, categories }: BlogIndexProps) {
  if (total === 0 && !category) {
    return <BlogStaticShelf />
  }

  if (total === 0 && category) {
    return <BlogEmptyCategory category={category} />
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const showSpotlight = page === 1 && posts.length > 0
  const spotlight = showSpotlight ? posts[0]! : null
  const gridPosts = showSpotlight ? posts.slice(1) : posts

  return (
    <section className="cin-section relative min-h-[40vh] overflow-hidden">
      <MarketingAtmosphere tone="light" />

      <div className="cin-container relative z-10 pb-24 pt-24 md:pb-32 md:pt-28 lg:pt-32">
        <header className="flex flex-col gap-8 border-b border-[var(--border)] pb-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="min-w-0">
            <div className="cin-kicker">Blog</div>
            <h1 className="cin-headline mt-4 max-w-[18ch] leading-[0.98] md:max-w-none" style={{ fontSize: 'clamp(2.15rem, 5vw, 3.75rem)' }}>
              Notes from the <span style={{ color: 'var(--coral)' }}>studio</span>.
            </h1>
            <p className="cin-body mt-5 max-w-xl text-sm md:text-base">
              {category ? (
                <>
                  Showing <span className="font-semibold text-[var(--foreground)]">“{category}”</span> — {total}{' '}
                  {total === 1 ? 'piece' : 'pieces'}.
                </>
              ) : (
                <>
                  {total} published {total === 1 ? 'note' : 'notes'}. Featured and newest surface first; use filters and
                  pages when the shelf fills up.
                </>
              )}
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="flex w-full max-w-full flex-col gap-2 lg:w-auto lg:max-w-[min(100%,28rem)] lg:items-end">
              <span className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-[color-mix(in_srgb,var(--lavender)_90%,transparent)]">
                Filter
              </span>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <FilterChip href={blogListHref({})} label="All" active={!category} />
                {categories.map((cat) => (
                  <FilterChip key={cat} href={blogListHref({ category: cat })} label={cat} active={category === cat} />
                ))}
              </div>
            </div>
          ) : null}
        </header>

        {spotlight ? (
          <div className="mt-12 lg:mt-14">
            <SpotlightCard post={spotlight} />
          </div>
        ) : null}

        {gridPosts.length > 0 ? (
          <ul
            className={`grid list-none grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 ${spotlight ? 'mt-10 lg:mt-12' : 'mt-14 lg:mt-16'}`}
          >
            {gridPosts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        ) : spotlight ? null : (
          <p className="mt-16 text-center font-sans text-sm text-[color-mix(in_srgb,var(--foreground)_50%,var(--lavender))]">
            No posts on this page.
          </p>
        )}

        <BlogPagination page={page} totalPages={totalPages} category={category} />
      </div>
    </section>
  )
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`rounded-full px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
        active
          ? 'bg-[var(--graphite)] text-white shadow-[0_8px_28px_rgba(31,31,36,0.2)]'
          : 'border border-[var(--border-strong)] bg-[var(--surface)] text-[color-mix(in_srgb,var(--foreground)_72%,var(--lavender))] hover:border-[color-mix(in_srgb,var(--coral)_38%,var(--border-strong))] hover:text-[var(--foreground)]'
      }`}
    >
      {label}
    </Link>
  )
}

function SpotlightCard({ post }: { post: BlogPostRow }) {
  const dateLabel = formatPostDate(post.publishedAt ? new Date(post.publishedAt) : null)

  if (post.coverImage) {
    return (
      <Link href={`/blog/${post.slug}`} className="group block">
        <article
          className="cin-panel relative overflow-hidden cin-hoverlift"
          style={{ boxShadow: '0 36px 100px rgba(0,0,0,0.08)' }}
        >
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-70 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
            style={{ background: 'radial-gradient(circle, rgba(255,122,89,0.22) 0%, transparent 70%)' }}
          />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 lg:gap-0">
            <div className="relative aspect-[16/10] min-h-[200px] overflow-hidden lg:aspect-auto lg:min-h-[300px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- CMS URL */}
              <img
                src={post.coverImage}
                alt=""
                className="absolute inset-0 size-full object-cover object-center transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--graphite)_50%,transparent)] to-transparent lg:bg-gradient-to-r" />
            </div>
            <SpotlightBody post={post} dateLabel={dateLabel} titleClass="text-2xl md:text-3xl lg:text-[2rem] xl:text-3xl" />
          </div>
        </article>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article
        className="cin-panel relative overflow-hidden cin-hoverlift"
        style={{ boxShadow: '0 28px 90px rgba(0,0,0,0.06)' }}
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full opacity-50 blur-3xl transition-opacity duration-700 group-hover:opacity-80"
          style={{ background: 'radial-gradient(circle, rgba(255,122,89,0.16) 0%, transparent 70%)' }}
        />
        <div className="relative border-l-[3px] border-[color-mix(in_srgb,var(--coral)_55%,var(--border))] pl-7 pr-8 py-9 md:pl-10 md:pr-12 md:py-12 lg:max-w-4xl">
          <SpotlightBody post={post} dateLabel={dateLabel} titleClass="text-2xl md:text-[1.85rem] lg:text-3xl" />
        </div>
      </article>
    </Link>
  )
}

function SpotlightBody({
  post,
  dateLabel,
  titleClass,
}: {
  post: BlogPostRow
  dateLabel: string | null
  titleClass: string
}) {
  return (
    <div className="relative flex flex-col justify-center p-8 md:p-10">
      <div className="flex flex-wrap items-center gap-2">
        {post.featured ? (
          <span className="rounded-full bg-[color-mix(in_srgb,var(--coral)_12%,transparent)] px-3 py-1 font-sans text-[10px] font-semibold tracking-[0.16em] text-[var(--coral-dark)] uppercase">
            Featured
          </span>
        ) : null}
        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)]">
          {post.category}
        </span>
        {dateLabel ? (
          <span className="font-mono text-[10px] tracking-[0.12em] text-[color-mix(in_srgb,var(--lavender)_90%,transparent)]">{dateLabel}</span>
        ) : null}
      </div>
      <h2
        className={`mt-4 font-display font-black leading-[1.08] tracking-tight text-[var(--foreground)] transition-colors duration-500 group-hover:text-[color-mix(in_srgb,var(--foreground)_88%,var(--coral))] ${titleClass}`}
      >
        {post.title}
      </h2>
      <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_55%,var(--lavender))] md:text-[15px]">
        {post.excerpt}
      </p>
      <p className="mt-8 flex flex-wrap items-center gap-3 font-mono text-[11px] tracking-[0.14em] text-[var(--lavender)]">
        <span className="inline-flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--coral)]" />
          {post.readingTime} min read
        </span>
        <span className="text-[var(--coral)] transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1">
          Read article →
        </span>
      </p>
    </div>
  )
}

function PostCard({ post }: { post: BlogPostRow }) {
  const dateLabel = formatPostDate(post.publishedAt ? new Date(post.publishedAt) : null)

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article
        className={`cin-panel flex h-full flex-col overflow-hidden cin-hoverlift ${post.coverImage ? '' : 'border-l-[3px] border-[color-mix(in_srgb,var(--coral)_40%,transparent)] transition-[border-color] duration-500 group-hover:border-[var(--coral)]'}`}
        style={{ borderRadius: '20px' }}
      >
        {post.coverImage ? (
          <div className="relative aspect-[16/10] shrink-0 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt=""
              className="absolute inset-0 size-full object-cover object-center transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_srgb,var(--graphite)_35%,transparent)] to-transparent opacity-80" />
          </div>
        ) : null}
        <div className={`flex flex-1 flex-col ${post.coverImage ? 'p-6' : 'p-6 md:p-7'}`}>
          <div className="flex flex-wrap items-center gap-2">
            {post.featured ? (
              <span className="rounded-full bg-[color-mix(in_srgb,var(--coral)_12%,transparent)] px-2 py-0.5 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--coral-dark)]">
                Featured
              </span>
            ) : null}
            <span className="font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)]">
              {post.category}
            </span>
            {dateLabel ? (
              <span className="font-mono text-[10px] tracking-[0.1em] text-[color-mix(in_srgb,var(--lavender)_90%,transparent)]">{dateLabel}</span>
            ) : null}
          </div>
          <h3 className="mt-3 font-display text-lg font-black leading-snug tracking-tight text-[var(--foreground)] transition-colors duration-500 group-hover:text-[color-mix(in_srgb,var(--foreground)_88%,var(--coral))] md:text-xl">
            {post.title}
          </h3>
          <p className="mt-3 line-clamp-4 flex-1 font-sans text-xs leading-relaxed text-[color-mix(in_srgb,var(--foreground)_48%,var(--lavender))] md:line-clamp-5">
            {post.excerpt}
          </p>
          <p className="mt-5 flex items-center justify-between font-mono text-[10px] tracking-[0.12em] text-[var(--lavender)]">
            <span>{post.readingTime} min</span>
            <span className="text-[var(--coral)] transition-transform duration-500 group-hover:translate-x-0.5">→</span>
          </p>
        </div>
      </article>
    </Link>
  )
}

function BlogEmptyCategory({ category }: { category: string }) {
  return (
    <section className="cin-section relative overflow-hidden">
      <MarketingAtmosphere tone="light" />
      <div className="cin-container cin-space pt-28 md:pt-32">
        <div className="cin-kicker">Blog</div>
        <h1 className="cin-headline mt-6" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Nothing in <span style={{ color: 'var(--coral)' }}>“{category}”</span> yet.
        </h1>
        <p className="cin-body mt-6 max-w-lg text-sm md:text-base">Try another category or view the full index.</p>
        <Link
          href="/blog"
          className="mt-10 inline-flex rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-6 py-3 font-display text-sm font-semibold text-[var(--foreground)] transition-colors hover:border-[color-mix(in_srgb,var(--coral)_40%,var(--border-strong))]"
        >
          Clear filter
        </Link>
      </div>
    </section>
  )
}

function BlogStaticShelf() {
  const [lead, ...rest] = notes

  return (
    <section className="cin-section relative overflow-hidden">
      <MarketingAtmosphere tone="light" />

      <div className="cin-container cin-space pt-28 md:pt-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="cin-kicker">Blog</div>
            <h1 className="cin-headline mt-6" style={{ fontSize: 'clamp(2.85rem, 7vw, 6.2rem)' }}>
              Notes from
              <br />
              the
              <span style={{ color: 'var(--coral)' }}> studio</span>.
            </h1>
            <p className="cin-body mt-8 max-w-md text-sm md:text-base">
              Long-form pieces are in the works. For now, this shelf holds the topics I’m writing toward — signal over noise.
            </p>
            <div
              className="mt-10 hidden h-px w-24 lg:block"
              style={{
                background: 'linear-gradient(90deg, var(--coral), transparent)',
              }}
            />
          </div>

          <div className="relative lg:col-span-7">
            <div
              className="pointer-events-none absolute -left-4 top-0 hidden h-full w-px lg:block"
              style={{ background: 'linear-gradient(180deg, var(--border-strong), transparent 85%)' }}
            />

            <article
              className="cin-panel relative overflow-hidden p-8 md:p-10 cin-hoverlift"
              style={{ boxShadow: '0 32px 100px rgba(0,0,0,0.07)' }}
            >
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl opacity-60"
                style={{ background: 'radial-gradient(circle, rgba(255,122,89,0.2) 0%, transparent 70%)' }}
              />
              <div className="relative flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[color-mix(in_srgb,var(--coral)_12%,transparent)] px-3 py-1 font-sans text-[10px] font-semibold tracking-[0.16em] text-[var(--coral-dark)] uppercase">
                  Featured
                </span>
                <span className="font-sans text-xs tracking-[0.2em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)] uppercase">{lead.tag}</span>
              </div>
              <h2 className="relative mt-5 font-display text-2xl font-black leading-tight tracking-tight text-[var(--foreground)] md:text-3xl">{lead.title}</h2>
              <p className="relative mt-4 font-sans text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_55%,var(--lavender))] md:text-[15px]">{lead.dek}</p>
              <p className="relative mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-[var(--lavender)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--coral)]" />
                Draft in progress
              </p>
            </article>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {rest.map((n) => (
                <article
                  key={n.title}
                  className="cin-panel relative overflow-hidden p-6 cin-hoverlift"
                  style={{ borderRadius: '20px' }}
                >
                  <span className="font-sans text-[10px] tracking-[0.2em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)] uppercase">{n.tag}</span>
                  <h3 className="mt-3 font-display text-xl font-black leading-snug tracking-tight text-[var(--foreground)]">{n.title}</h3>
                  <p className="mt-3 font-sans text-xs leading-relaxed text-[color-mix(in_srgb,var(--foreground)_50%,var(--lavender))]">{n.dek}</p>
                  <p className="mt-5 font-mono text-[10px] tracking-[0.12em] text-[var(--lavender)]">Coming soon</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
