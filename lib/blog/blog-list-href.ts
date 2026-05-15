/** Build `/blog` URLs with optional pagination and category filter. */
export function blogListHref(opts: { page?: number; category?: string | null }) {
  const p = new URLSearchParams()
  if (opts.page != null && opts.page > 1) p.set('page', String(opts.page))
  const c = opts.category?.trim()
  if (c) p.set('category', c)
  const s = p.toString()
  return s ? `/blog?${s}` : '/blog'
}
