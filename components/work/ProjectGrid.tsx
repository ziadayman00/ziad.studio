import ArchiveMasonry from './ArchiveMasonry'
import type { Project } from '@/lib/projects'

type ProjectGridProps = {
  projects: Project[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return <ArchiveMasonry projects={projects} />
}
