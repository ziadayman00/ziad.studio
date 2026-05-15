import FeaturedProjectBlocks from '@/components/work/FeaturedProjectBlocks'
import ProjectGrid from '@/components/work/ProjectGrid'
import WorkVisualStrip from '@/components/work/WorkVisualStrip'
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
  const stripOrder = [...featured, ...archive]

  return (
    <section className="cin-section relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-28 md:pt-32 pb-24 md:pb-28">
        {/* Hero: hook + stats, then visual reel */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 items-end">
          <div className="xl:col-span-8 min-w-0">
            <div className="cin-kicker">Archive</div>
            <h1 className="cin-headline mt-6" style={{ fontSize: 'clamp(3rem, 7vw, 6.8rem)' }}>
              Work that feels
              <br />
              like a
              <span style={{ color: 'var(--coral)' }}> scene</span>.
            </h1>
            <p className="cin-body mt-5 max-w-2xl text-base md:text-lg">
              Browse the frames first — each project is built as a digital object, not a template row.
            </p>
          </div>

          <div className="xl:col-span-4 min-w-0">
            <div className="cin-panel p-7">
              <div className="flex items-center justify-between">
                <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--foreground-muted)' }}>
                  Total artifacts
                </span>
                <span className="font-display font-black text-2xl" style={{ color: 'var(--foreground)' }}>
                  {projects.length}
                </span>
              </div>
              <p className="cin-body mt-4 text-sm">
                Each featured piece opens as a full scene. Archive stays a polaroid wall.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 md:mt-12 xl:mt-14 min-w-0 lg:-mx-2 xl:-mx-4">
          <WorkVisualStrip projects={stripOrder} />
        </div>

        {/* Featured — cinema sheets */}
        {featured.length > 0 ? (
          <section className="mt-16 md:mt-24">
            <div className="mb-8 sm:mb-10 md:mb-12">
              <div className="cin-kicker">Featured</div>
              <p className="mt-3 max-w-lg font-mono text-[10px] uppercase leading-relaxed tracking-[0.24em] text-[var(--foreground-muted)]">
                Same frame for every spotlight — big type, top-anchored imagery, one door in.
              </p>
            </div>
            <FeaturedProjectBlocks projects={featured} />
          </section>
        ) : null}

        {/* Archive — polaroid wall (not a list) */}
        <section className="mt-20 md:mt-28">
          <div className="mb-2 flex flex-wrap items-baseline gap-4">
            <div className="cin-kicker">Archive</div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--foreground-muted)]">wall</span>
          </div>
          {archive.length === 0 ? (
            <div className="cin-panel p-8">
              <p className="cin-body text-sm">More prints will land here as you publish.</p>
            </div>
          ) : (
            <ProjectGrid projects={archive} />
          )}
        </section>
      </div>
    </section>
  )
}
