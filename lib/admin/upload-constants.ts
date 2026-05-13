/** Supabase Storage bucket for portfolio images (create as public in dashboard). */
export const PORTFOLIO_MEDIA_BUCKET = 'portfolio-media'

export const MAX_IMAGE_BYTES = 12 * 1024 * 1024 // 12 MB per file

export const ALLOWED_IMAGE_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])
