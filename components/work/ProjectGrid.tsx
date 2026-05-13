import ProjectCard from './ProjectCard'
import type { Project } from '@/lib/projects'

type ProjectGridProps = {
  projects: Project[]
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="border-t border-[var(--border)]">
      {projects.map((project, i) => (
        <ProjectCard key={project.id} project={project} index={i} />
      ))}
    </div>
  )
}
