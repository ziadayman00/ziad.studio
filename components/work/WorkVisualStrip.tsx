import Link from 'next/link'

import type { Project } from '@/lib/projects'

type WorkVisualStripProps = {
  /** Featured first, then others — same order as the page. */
  projects: Project[]
  /** Max frames in the strip (layout + performance). */
  limit?: number
}

export default function WorkVisualStrip({ projects, limit = 11 }: WorkVisualStripProps) {
  const items = projects.slice(0, limit).map((p) => ({
    slug: p.slug,
    title: p.title,
    color: p.color,
    src: p.images?.[0] ?? '/assets/hero-poster.jpg',
  }))

  if (items.length === 0) return null

  return (
    <div className="w-full min-w-0">
      {/* Mobile / tablet: horizontal reel */}
      <div
        className="flex lg:hidden gap-3 sm:gap-4 overflow-x-auto pb-2 pt-1 -mx-1 px-1 snap-x snap-mandatory [scrollbar-width:thin]"
        style={{
          maskImage: 'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, black 5%, black 95%, transparent 100%)',
        }}
      >
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/work/${item.slug}`}
            className="group relative shrink-0 w-[min(52vw,220px)] sm:w-[min(40vw,260px)] snap-start snap-always overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-secondary)] shadow-[0_12px_40px_rgba(12,12,18,0.08)] transition-all duration-500 ease-[var(--ease-out-expo)] active:scale-[0.98] hover:shadow-[0_20px_50px_rgba(12,12,18,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--coral)]"
            style={{ aspectRatio: '3 / 4' }}
          >
            <img
              src={item.src}
              alt=""
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
              loading="lazy"
            />
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              style={{
                background: `linear-gradient(180deg, transparent 45%, color-mix(in srgb, ${item.color} 38%, black) 100%)`,
              }}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <span className="font-display text-sm font-semibold leading-tight text-white drop-shadow-md line-clamp-2">
                {item.title}
              </span>
            </div>
            <span className="sr-only">{item.title}</span>
          </Link>
        ))}
      </div>

      {/* Desktop: overlapping deck (later siblings paint on top) */}
      <div className="hidden lg:flex lg:justify-center lg:overflow-visible lg:py-2">
        <div className="flex items-end justify-center">
          {items.map((item, i) => (
            <Link
              key={item.slug}
              href={`/work/${item.slug}`}
              className={`group relative w-[clamp(168px,12.5vw,236px)] overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-secondary)] shadow-[0_18px_55px_rgba(12,12,18,0.14)] transition-all duration-500 ease-[var(--ease-out-expo)] hover:z-50 hover:-translate-y-3 hover:scale-[1.045] hover:rotate-0 hover:shadow-[0_28px_80px_rgba(12,12,18,0.2)] focus-visible:z-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--coral)] ${
                i % 2 === 0 ? '-rotate-[1.2deg]' : 'rotate-[1.2deg]'
              }`}
              style={{
                aspectRatio: '3 / 4',
                marginLeft: i === 0 ? 0 : '-2.65rem',
              }}
            >
              <img
                src={item.src}
                alt=""
                className="h-full w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
                loading={i < 4 ? 'eager' : 'lazy'}
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(180deg, transparent 40%, color-mix(in srgb, ${item.color} 40%, black) 100%)`,
                }}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="font-display text-base font-semibold leading-snug text-white drop-shadow-md line-clamp-2">
                  {item.title}
                </span>
              </div>
              <span className="sr-only">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
