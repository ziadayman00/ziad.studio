import Link from 'next/link'

import { blogListHref } from '@/lib/blog/blog-list-href'

/** Smarter window: 1 … mid … last */
function pageItems(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const set = new Set<number>()
  set.add(1)
  set.add(total)
  for (let d = 0; d <= 2; d++) {
    if (current - d >= 1) set.add(current - d)
    if (current + d <= total) set.add(current + d)
  }
  const sorted = [...set].sort((a, b) => a - b)
  const out: (number | 'gap')[] = []
  for (let i = 0; i < sorted.length; i++) {
    const n = sorted[i]!
    if (i > 0 && n - (sorted[i - 1] ?? 0) > 1) out.push('gap')
    out.push(n)
  }
  return out
}

export default function BlogPagination({
  page,
  totalPages,
  category,
}: {
  page: number
  totalPages: number
  category: string | null
}) {
  if (totalPages <= 1) return null

  const items = pageItems(page, totalPages)

  return (
    <nav className="mt-14 flex flex-col items-center gap-6 border-t border-[var(--border)] pt-12 md:mt-16 md:pt-14" aria-label="Blog pagination">
      <p className="font-mono text-[11px] tracking-[0.16em] text-[color-mix(in_srgb,var(--lavender)_90%,transparent)]">
        Page <span className="text-[var(--foreground)]">{page}</span> of <span className="text-[var(--foreground)]">{totalPages}</span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <PaginationLink
          href={page > 1 ? blogListHref({ page: page - 1, category }) : null}
          label="Previous"
          disabled={page <= 1}
        />
        <div className="mx-2 hidden h-4 w-px bg-[var(--border-strong)] sm:block" aria-hidden />
        <ul className="flex flex-wrap items-center justify-center gap-1.5">
          {items.map((item, idx) =>
            item === 'gap' ? (
              <li key={`gap-${idx}`} className="px-1 font-mono text-xs text-[var(--lavender)]">
                …
              </li>
            ) : (
              <li key={item}>
                <Link
                  href={blogListHref({ page: item, category })}
                  className={`flex min-w-[2.5rem] items-center justify-center rounded-full px-3 py-2 font-mono text-[11px] font-medium tracking-[0.08em] transition-colors duration-300 ${
                    item === page
                      ? 'bg-[var(--graphite)] text-white'
                      : 'text-[color-mix(in_srgb,var(--foreground)_65%,var(--lavender))] hover:bg-[var(--surface-secondary)] hover:text-[var(--foreground)]'
                  }`}
                  aria-current={item === page ? 'page' : undefined}
                >
                  {item}
                </Link>
              </li>
            )
          )}
        </ul>
        <div className="mx-2 hidden h-4 w-px bg-[var(--border-strong)] sm:block" aria-hidden />
        <PaginationLink
          href={page < totalPages ? blogListHref({ page: page + 1, category }) : null}
          label="Next"
          disabled={page >= totalPages}
        />
      </div>
    </nav>
  )
}

function PaginationLink({ href, label, disabled }: { href: string | null; label: string; disabled: boolean }) {
  if (disabled || !href) {
    return (
      <span className="rounded-full border border-transparent px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[color-mix(in_srgb,var(--lavender)_55%,transparent)]">
        {label}
      </span>
    )
  }
  return (
    <Link
      href={href}
      className="rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--foreground)] transition-colors duration-300 hover:border-[color-mix(in_srgb,var(--coral)_40%,var(--border-strong))] hover:text-[var(--coral-dark)]"
    >
      {label}
    </Link>
  )
}
