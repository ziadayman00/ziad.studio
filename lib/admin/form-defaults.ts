import type { Project } from '@/lib/projects'

export type ProjectFormDefaults = {
  title: string
  slug: string
  subtitle: string
  category: string
  year: string
  description: string
  longDescription: string
  responsibility: string
  impact: string
  tags: string
  features: string
  images: string
  live: string
  github: string
  color: string
  sortOrder: number
  featured: boolean
  comingSoon: boolean
  inProgress: boolean
}

export function emptyDefaults(sortOrder: number): ProjectFormDefaults {
  return {
    title: '',
    slug: '',
    subtitle: '',
    category: 'Full-Stack',
    year: String(new Date().getFullYear()),
    description: '',
    longDescription: '',
    responsibility: '',
    impact: '',
    tags: '',
    features: '',
    images: '',
    live: '',
    github: '',
    color: '#FF7A59',
    sortOrder,
    featured: false,
    comingSoon: false,
    inProgress: false,
  }
}

export function projectToFormDefaults(p: Project): ProjectFormDefaults {
  return {
    title: p.title,
    slug: p.slug,
    subtitle: p.subtitle,
    category: p.category,
    year: p.year,
    description: p.description,
    longDescription: p.longDescription,
    responsibility: p.responsibility ?? '',
    impact: p.impact ?? '',
    tags: p.tags.join(', '),
    features: (p.features ?? []).join('\n'),
    images: (p.images ?? []).join('\n'),
    live: p.live ?? '',
    github: p.github ?? '',
    color: p.color,
    sortOrder: p.sortOrder ?? 0,
    featured: p.featured,
    comingSoon: p.comingSoon ?? false,
    inProgress: p.inProgress ?? false,
  }
}
