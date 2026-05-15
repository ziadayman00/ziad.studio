import Link from 'next/link'

import type { Project } from '@/lib/projects'

type Props = {
  projects: Project[]
}

/** Full-bleed “cinema sheet” — same structure for every featured project. */
export default function FeaturedProjectBlocks({ projects }: Props) {
  if (projects.length === 0) return null

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      {projects.map((project, i) => {
        const img = project.images?.[0] ?? '/assets/hero-poster.jpg'
        const n = String(i + 1).padStart(2, '0')

        return (
          <Link
            key={project.slug}
            href={`/work/${project.slug}`}
            className="group relative block min-w-0"
          >
            <article className="relative min-h-[min(88vh,820px)] w-full overflow-hidden rounded-[clamp(1.25rem,4vw,2rem)] border border-[var(--border)] bg-[var(--graphite)] shadow-[0_40px_120px_rgba(0,0,0,0.35)] md:min-h-[min(78vh,760px)]">
              <img
                src={img}
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-top opacity-90 transition-all duration-[1.1s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06] group-hover:opacity-100"
                sizes="100vw"
              />
              <div
                className="absolute inset-0 opacity-[0.28] mix-blend-multiply"
                style={{
                  background: `radial-gradient(ellipse 95% 70% at 50% 0%, ${project.color}, transparent 62%)`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/55 via-40% to-transparent" />
              <div className="pointer-events-none absolute inset-0 opacity-25 intro-grain" />

              <div
                className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 font-mono text-[10px] font-medium uppercase tracking-[0.35em] text-white/35 md:left-6 md:block"
                style={{ writingMode: 'vertical-rl', transform: 'translateY(-50%) rotate(180deg)' }}
              >
                scene · {n}
              </div>

              <div className="relative z-10 flex h-full min-h-[min(88vh,820px)] flex-col justify-end p-6 pb-10 sm:p-10 md:min-h-[min(78vh,760px)] md:p-12 md:pb-14">
                <div className="max-w-4xl">
                  <span
                    className="inline-flex origin-left border border-white/20 bg-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.28em] text-white/90 backdrop-blur-md transition-transform duration-500 group-hover:scale-105"
                    style={{ boxShadow: `0 0 0 1px color-mix(in srgb, ${project.color} 40%, transparent)` }}
                  >
                    {project.category} — {project.year}
                  </span>
                  <h2 className="mt-6 font-display text-[clamp(2.4rem,8.5vw,5.8rem)] font-bold leading-[0.92] tracking-[-0.045em] text-white drop-shadow-[0_4px_48px_rgba(0,0,0,0.5)]">
                    {project.title}
                  </h2>
                  <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-white/72 md:text-lg">{project.subtitle}</p>
                </div>

                <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-white/10 pt-8">
                  <p className="max-w-md font-sans text-sm leading-relaxed text-white/50 md:text-[15px]">
                    {project.description.length > 160 ? `${project.description.slice(0, 157)}…` : project.description}
                  </p>
                  <span
                    className="inline-flex items-center gap-3 rounded-full px-6 py-3 font-display text-sm font-semibold text-[var(--graphite)] transition-all duration-500 group-hover:gap-4"
                    style={{ background: project.color, boxShadow: `0 12px 40px color-mix(in srgb, ${project.color} 45%, transparent)` }}
                  >
                    Enter frame
                    <span className="text-lg" aria-hidden>
                      ↗
                    </span>
                  </span>
                </div>
              </div>
            </article>

            {/* Floating preview — light frosted glass, light blur */}
            <aside
              className="pointer-events-none absolute right-3 top-3 z-[35] hidden w-[min(272px,calc(100vw-2.5rem))] origin-top-right scale-[0.94] opacity-0 transition-all duration-500 ease-[var(--ease-out-expo)] motion-reduce:duration-200 group-hover:scale-100 group-hover:opacity-100 group-hover:-rotate-[0.35deg] md:block lg:right-6 lg:top-6"
              aria-hidden
            >
              <div
                className="overflow-hidden rounded-2xl border border-white/45 bg-white/[0.14] backdrop-blur-[10px] backdrop-saturate-150"
                style={{
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.52), 0 18px 48px rgba(12,12,18,0.18), 0 0 0 1px color-mix(in srgb, ${project.color} 26%, transparent)`,
                }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-white/10" />
                  <div
                    className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-80"
                    aria-hidden
                  />
                  <span className="absolute left-3 top-3 rounded bg-black/35 px-1.5 py-0.5 font-mono text-[10px] font-medium tabular-nums tracking-[0.18em] text-white/95 backdrop-blur-[2px]">
                    {n}
                  </span>
                </div>
                <div className="space-y-2 border-t border-white/35 bg-white/[0.22] p-4 backdrop-blur-[4px]">
                  <p className="font-display text-[15px] font-semibold leading-snug tracking-[-0.02em] text-[var(--graphite)] line-clamp-2">
                    {project.title}
                  </p>
                  <p className="font-sans text-[12px] leading-relaxed text-[color-mix(in_srgb,var(--graphite)_58%,var(--foreground-muted))] line-clamp-2">
                    {project.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {(project.tags ?? []).slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[color-mix(in_srgb,var(--graphite)_12%,transparent)] bg-white/50 px-2 py-0.5 font-mono text-[8px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </Link>
        )
      })}
    </div>
  )
}
