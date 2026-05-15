import Link from 'next/link'

import type { Project } from '@/lib/projects'

const TILTS = ['-rotate-[2.4deg]', 'rotate-[3deg]', '-rotate-[1.6deg]', 'rotate-[2.2deg]', '-rotate-[2.8deg]'] as const

type Props = {
  projects: Project[]
}

/**
 * Polaroid column masonry — breaks the “spreadsheet list” feel of the archive.
 */
export default function ArchiveMasonry({ projects }: Props) {
  if (projects.length === 0) return null

  return (
    <div className="relative">
      <p className="mb-6 max-w-md font-mono text-[10px] uppercase leading-relaxed tracking-[0.28em] text-[var(--foreground-muted)] md:mb-8">
        Loose prints — grab one. Order is chronological, rhythm is chaos.
      </p>

      <div className="columns-2 gap-x-4 sm:gap-x-5 md:columns-3 md:gap-x-6 [column-fill:_balance]">
        {projects.map((project, i) => {
          const thumb = project.images?.[0] ?? '/assets/hero-poster.jpg'
          const tilt = TILTS[i % TILTS.length]
          const n = String(i + 1).padStart(2, '0')

          return (
            <Link
              key={project.id}
              href={`/work/${project.slug}`}
              className={`group mb-7 block break-inside-avoid origin-top transition-all duration-500 ease-[var(--ease-out-expo)] motion-reduce:rotate-0 motion-reduce:hover:scale-100 hover:z-20 hover:rotate-0 hover:scale-[1.04] sm:mb-8 ${tilt}`}
            >
              <article
                className="relative overflow-hidden border border-[color-mix(in_srgb,var(--border-strong)_65%,var(--foreground-muted))] bg-[linear-gradient(165deg,#fffdf9_0%,#f3f1ec_100%)] p-2.5 pb-8 shadow-[0_14px_0_rgba(12,12,18,0.06),0_22px_48px_rgba(12,12,18,0.1)] transition-shadow duration-500 group-hover:shadow-[0_18px_0_rgba(12,12,18,0.05),0_36px_70px_rgba(12,12,18,0.16)]"
              >
                <div className="relative aspect-[5/6] w-full overflow-hidden bg-[var(--surface-secondary)]">
                  <img
                    src={thumb}
                    alt=""
                    className="h-full w-full object-cover object-top transition-all duration-700 ease-[var(--ease-out-expo)] grayscale-[0.25] contrast-[1.02] group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-[1.06]"
                    loading="lazy"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-0 mix-blend-multiply transition-opacity duration-500 group-hover:opacity-[0.35]"
                    style={{ background: project.color }}
                  />
                  <span className="pointer-events-none absolute left-2 top-2 font-mono text-[9px] font-medium tabular-nums text-white/90 mix-blend-difference drop-shadow-sm">
                    {n}
                  </span>
                </div>

                <div className="mt-4 px-1 text-center">
                  <h3 className="font-display text-[15px] font-semibold leading-snug tracking-[-0.02em] text-[var(--foreground)] transition-colors duration-300 group-hover:text-[var(--coral)] md:text-base">
                    {project.title}
                  </h3>
                  <p className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                    {project.year} · {project.category}
                  </p>
                </div>

                <div
                  className="pointer-events-none absolute -bottom-1 left-1/2 h-3 w-[72%] -translate-x-1/2 rounded-[100%] bg-black/12 blur-md"
                  aria-hidden
                />
              </article>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
