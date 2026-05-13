/**
 * Top-level path segments that use the public marketing shell (navbar + footer).
 * Anything else is treated as a minimal app surface (e.g. secret studio path).
 */
const PUBLIC_ROOT_SEGMENTS = new Set(['about', 'blog', 'contact', 'services', 'work'])

/**
 * True when the pathname should not show global navbar, footer, or atmosphere.
 */
export function isMinimalShellPath(pathname: string | null): boolean {
  if (!pathname) return false
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) return true

  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) return false

  const root = parts[0]
  if (!root) return false

  if (PUBLIC_ROOT_SEGMENTS.has(root)) return false

  // Next internals & static
  if (root.startsWith('_next') || root === 'favicon.ico' || root === 'robots.txt' || root === 'sitemap.xml') {
    return false
  }

  return true
}
