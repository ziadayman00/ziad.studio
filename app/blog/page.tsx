import BlogIndex from '@/components/blog/BlogIndex'
import { countPublishedBlogPosts, getPublishedBlogCategories, getPublishedBlogPostsPage } from '@/lib/blog/queries'

const PAGE_SIZE = 12

type Props = {
  searchParams: Promise<{ page?: string; category?: string }>
}

export async function generateMetadata({ searchParams }: Props) {
  const base = { title: 'Blog — Ziad', description: 'Thoughts on creative development, systems, and motion.' }
  const sp = await searchParams
  const category = sp.category?.trim() || null
  const total = await countPublishedBlogPosts(category)
  if (total === 0 && !category) {
    return base
  }
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const rawPage = Math.max(1, parseInt(sp.page ?? '1', 10) || 1)
  const page = Math.min(rawPage, totalPages)
  if (page > 1) {
    return { ...base, title: `Blog — Page ${page}` }
  }
  return base
}

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams
  const category = sp.category?.trim() || null
  const total = await countPublishedBlogPosts(category)
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const rawPage = Math.max(1, parseInt(sp.page ?? '1', 10) || 1)
  const page = Math.min(rawPage, totalPages)

  const [posts, categories] = await Promise.all([
    getPublishedBlogPostsPage({ page, pageSize: PAGE_SIZE, category }),
    getPublishedBlogCategories(),
  ])

  return (
    <BlogIndex posts={posts} total={total} page={page} pageSize={PAGE_SIZE} category={category} categories={categories} />
  )
}
