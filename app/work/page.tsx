import Link from 'next/link'

import ProjectGrid from '@/components/work/ProjectGrid'
import { getProjects } from '@/lib/projects'

export const metadata = {
  title: 'Work — Ziad',
  description: 'Selected artifacts, experiments, and product stories.',
}

export const revalidate = 0

export default async function WorkPage() {
  const projects = await getProjects()
  const featured = projects.filter((p) => p.featured)
  const archive = projects.filter((p) => !p.featured)

  return (
    <section className="cin-section relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-24 md:pb-28">
        {/* Header */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 items-end">
          <div className="xl:col-span-8 min-w-0">
            <div className="cin-kicker">Archive</div>
            <h1 className="cin-headline mt-6" style={{ fontSize: 'clamp(3rem, 7vw, 6.8rem)' }}>
              Work that feels
              <br />
              like a
              <span style={{ color: 'var(--coral)' }}> scene</span>.
            </h1>
          </div>

          <div className="xl:col-span-4 min-w-0">
            <div className="cin-panel p-7">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                  Total artifacts
                </span>
                <span className="font-display font-black text-2xl" style={{ color: 'var(--foreground)' }}>
                  {projects.length}
                </span>
              </div>
              <p className="cin-body mt-4 text-sm">
                A curated sequence of projects. Each one is treated like a digital object — not a thumbnail.
              </p>
            </div>
          </div>
        </div>

        {/* Featured */}
        <section className="mt-16 md:mt-20">
          <div className="cin-kicker mb-8">Featured</div>
          <div className="grid grid-cols-1 gap-6 lg:gap-8">
            {featured.map((project) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="group cin-panel cin-hoverlift block overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center p-7 md:p-9">
                  <div className="md:col-span-7 min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="w-2 h-2 rounded-full" style={{ background: project.color }} />
                      <span className="font-sans text-[11px] tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                        {project.category}
                      </span>
                      <span className="font-sans text-[11px]" style={{ color: 'var(--lavender)', opacity: 0.7 }}>
                        {project.year}
                      </span>
                    </div>
                    <div className="mt-4 font-display font-black text-3xl md:text-5xl tracking-tight" style={{ color: 'var(--foreground)' }}>
                      {project.title}
                    </div>
                    <p className="mt-4 cin-body text-sm md:text-base">{project.subtitle}</p>
                  </div>
                  <div className="md:col-span-5">
                    <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface-secondary)]">
                      <img
                        src={project.images?.[0] ?? '/assets/hero-poster.jpg'}
                        alt=""
                        className="w-full h-44 md:h-52 object-cover object-top transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Archive */}
        <section className="mt-20 md:mt-24">
          <div className="cin-kicker mb-8">Archive</div>
          {archive.length === 0 ? (
            <div className="cin-panel p-8">
              <p className="cin-body text-sm">More projects will appear here as they are added.</p>
            </div>
          ) : (
            <ProjectGrid projects={archive} />
          )}
        </section>
      </div>
    </section>
  )
}
