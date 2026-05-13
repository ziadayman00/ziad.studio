'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { Project } from '@/lib/projects'

type ProjectCardProps = {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link href={`/work/${project.slug}`}>
      <article
        className="relative border-b border-[var(--border)] group cursor-pointer last:border-b-0"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex items-center justify-between py-8 md:py-10 px-0 transition-all duration-500">
          <div className="flex items-center gap-6 md:gap-10 min-w-0">
            <span
              className="font-display font-black text-xs md:text-sm tabular-nums transition-colors duration-300 shrink-0"
              style={{ color: hovered ? 'var(--coral)' : 'var(--lavender)' }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className="flex flex-col gap-1 min-w-0">
              <h3
                className="font-display font-black transition-all duration-500 leading-tight"
                style={{
                  fontSize: 'clamp(1.25rem, 3.5vw, 2.5rem)',
                  color: hovered ? 'var(--coral)' : 'var(--foreground)',
                  transform: hovered ? 'translateX(8px)' : 'translateX(0)',
                }}
              >
                {project.title}
              </h3>
              <p
                className="font-sans text-xs md:text-sm text-[var(--lavender)] transition-all duration-300 max-w-md"
                style={{
                  opacity: hovered ? 1 : 0,
                  transform: hovered ? 'translateY(0)' : 'translateY(-6px)',
                }}
              >
                {project.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 md:gap-10 shrink-0">
            <span className="hidden md:block font-sans text-xs tracking-widest uppercase text-[var(--lavender)]">
              {project.category}
            </span>
            <span className="font-sans text-xs text-[var(--lavender)]">{project.year}</span>
            <span
              className="font-display text-xl transition-all duration-500"
              style={{
                color: 'var(--coral)',
                opacity: hovered ? 1 : 0,
                transform: hovered ? 'translateX(0) rotate(0deg)' : 'translateX(-10px) rotate(-45deg)',
              }}
            >
              ↗
            </span>
          </div>
        </div>

        <div
          className="absolute bottom-0 left-0 h-px bg-[var(--coral)] transition-all duration-500"
          style={{ width: hovered ? '100%' : '0%' }}
        />
      </article>
    </Link>
  )
}
