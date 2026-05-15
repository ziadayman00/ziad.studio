import type { BlogPostRow } from '@/lib/db/schema'

export type BlogFormDefaults = {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  tags: string
  published: boolean
  featured: boolean
  readingTime: number
}

export function emptyBlogDefaults(): BlogFormDefaults {
  return {
    slug: '',
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: 'Notes',
    tags: '',
    published: false,
    featured: false,
    readingTime: 5,
  }
}

export function rowToBlogDefaults(row: BlogPostRow): BlogFormDefaults {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.coverImage ?? '',
    category: row.category,
    tags: (row.tags ?? []).join(', '),
    published: row.published,
    featured: row.featured,
    readingTime: row.readingTime,
  }
}
