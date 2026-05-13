import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProjects } from '@/lib/projects'
import ProjectLightbox from '@/components/work/ProjectLightbox'

type Props = {
  params: Promise<{ slug: string }>
}

export const revalidate = 0

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const requested = decodeURIComponent(slug || '').trim().toLowerCase()
  const projects = await getProjects()
  const p =
    projects.find((x) => x.slug === requested) ??
    projects.find((x) => x.slug === requested.replace(/\/+$/, '')) ??
    projects.find((x) => x.slug === requested.replace(/^\/+/, '')) ??
    null
  if (!p) return { title: 'Work — Ziad' }
  return {
    title: `${p.title} — Ziad`,
    description: p.description,
  }
}

export default async function WorkSlugPage({ params }: Props) {
  const { slug } = await params
  const requested = decodeURIComponent(slug || '').trim().toLowerCase()
  const projects = await getProjects()
  const p =
    projects.find((x) => x.slug === requested) ??
    projects.find((x) => x.slug === requested.replace(/\/+$/, '')) ??
    projects.find((x) => x.slug === requested.replace(/^\/+/, '')) ??
    null
  if (!p) notFound()

  const index = projects.findIndex((x) => x.slug === p.slug)
  const prev = index > 0 ? projects[index - 1] : null
  const next = index < projects.length - 1 ? projects[index + 1] : null
  const heroImage = p.images?.[0] ?? '/assets/hero-poster.jpg'

  return (
    <div className="relative">
      {/* Opening frame */}
      <section className="relative overflow-hidden cin-section">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(820px 620px at 65% 30%, ${p.color}20 0%, transparent 65%), radial-gradient(860px 640px at 30% 80%, rgba(110,168,254,0.10) 0%, transparent 70%), linear-gradient(180deg, rgba(247,247,242,1) 0%, rgba(247,247,242,0.92) 55%, rgba(247,247,242,1) 100%)`,
          }}
        />
        <div className="absolute inset-0 intro-grain" style={{ opacity: 0.35 }} />

        <div className="cin-container pt-28 md:pt-32 pb-10 md:pb-12 relative">
          <div className="flex items-center justify-between gap-8">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-widest uppercase"
              style={{ color: 'var(--lavender)' }}
            >
              <span style={{ color: 'var(--coral)' }}>←</span> Back to archive
            </Link>
            <div className="hidden md:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                {p.category}
              </span>
              <span className="font-sans text-xs" style={{ color: 'var(--lavender)', opacity: 0.7 }}>
                {p.year}
              </span>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 items-end">
            <div className="xl:col-span-8 min-w-0">
              <h1 className="cin-headline" style={{ fontSize: 'clamp(3.1rem, 7.4vw, 7.4rem)', color: 'var(--foreground)' }}>
                {p.title}
              </h1>
              <p className="mt-4 font-sans text-base md:text-lg" style={{ color: 'var(--lavender)', maxWidth: 880 }}>
                {p.subtitle}
              </p>
            </div>
            <div className="xl:col-span-4 min-w-0">
              <div className="cin-panel p-6 md:p-7">
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                    Artifact data
                  </span>
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                </div>
                <p className="mt-4 font-sans text-sm md:text-base leading-relaxed" style={{ color: 'var(--lavender)' }}>
                  {p.longDescription}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span key={t} className="font-sans text-[11px] tracking-widest uppercase rounded-full px-3 py-1 border" style={{ borderColor: 'var(--border)', color: 'var(--lavender)', background: 'rgba(255,255,255,0.55)' }}>
                {t}
              </span>
            ))}
            {p.inProgress && (
              <span className="font-sans text-[11px] tracking-widest uppercase rounded-full px-3 py-1 border" style={{ borderColor: 'rgba(255,122,89,0.28)', color: 'var(--coral)', background: 'rgba(255,122,89,0.06)' }}>
                In progress
              </span>
            )}
            {p.comingSoon && (
              <span className="font-sans text-[11px] tracking-widest uppercase rounded-full px-3 py-1 border" style={{ borderColor: 'rgba(110,168,254,0.24)', color: 'var(--blue)', background: 'rgba(110,168,254,0.06)' }}>
                Coming soon
              </span>
            )}
          </div>
        </div>

        {/* Hero media */}
        <div className="cin-container pb-16 md:pb-20">
          <div
            className="relative rounded-[28px] overflow-hidden border"
            style={{
              borderColor: 'var(--border)',
              boxShadow: '0 40px 140px rgba(0,0,0,0.10)',
              background: 'var(--surface-secondary)',
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(900px 600px at 70% 35%, ${p.color}22 0%, transparent 62%), linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.10) 100%)`,
              }}
            />
            <img
              src={heroImage}
              alt={`${p.title} hero`}
              className="relative w-full h-[360px] sm:h-[420px] md:h-[520px] lg:h-[600px] object-cover object-top"
            />
            <div className="absolute inset-0 intro-grain" style={{ opacity: 0.24 }} />
          </div>
        </div>
      </section>

      {/* Scene body */}
      <section className="cin-section">
        <div className="cin-container cin-space pt-16 md:pt-20">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12 items-start">
            {/* Left narrative */}
            <div className="xl:col-span-7 min-w-0">
              <div className="cin-kicker">Overview</div>
              <h2 className="cin-headline mt-6" style={{ fontSize: 'clamp(2.2rem, 4.8vw, 3.8rem)' }}>
                What it is.
              </h2>
              <p className="cin-body mt-6 text-base md:text-lg">
                {p.description}
              </p>

              {!!p.features?.length && (
                <div className="mt-12">
                  <div className="cin-kicker">Features</div>
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {p.features.map((f) => (
                      <div key={f} className="cin-panel p-4 md:p-5 cin-hoverlift">
                        <div className="flex items-start justify-between gap-4">
                          <span className="font-sans text-sm leading-relaxed" style={{ color: 'var(--lavender)' }}>
                            {f}
                          </span>
                          <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: p.color, opacity: 0.7 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right side: sticky artifact data */}
            <div className="xl:col-span-5 min-w-0">
              <div className="cin-panel p-7 md:p-8" style={{ position: 'sticky', top: 110 }}>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                    Scene data
                  </span>
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                      Year
                    </span>
                    <div className="mt-1 font-display font-black" style={{ color: 'var(--foreground)' }}>
                      {p.year}
                    </div>
                  </div>
                  <div>
                    <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                      Sector
                    </span>
                    <div className="mt-1 font-display font-black" style={{ color: 'var(--foreground)' }}>
                      {p.category}
                    </div>
                  </div>
                  {p.responsibility && (
                    <div className="col-span-2">
                      <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                        Responsibility
                      </span>
                      <div className="mt-1 font-sans text-sm leading-relaxed" style={{ color: 'var(--lavender)' }}>
                        {p.responsibility}
                      </div>
                    </div>
                  )}
                  {p.impact && (
                    <div className="col-span-2">
                      <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                        Impact
                      </span>
                      <div className="mt-1 font-display font-black" style={{ color: 'var(--foreground)' }}>
                        {p.impact}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <span className="font-sans text-xs tracking-widest uppercase" style={{ color: 'var(--lavender)' }}>
                    Stack
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={`stack-${t}`} className="font-sans text-[11px] tracking-widest uppercase rounded-full px-3 py-1 border" style={{ borderColor: 'var(--border)', color: 'var(--lavender)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  {p.live && p.live !== '#' && (
                    <a href={p.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-display font-semibold text-sm px-7 py-3.5 rounded-full" style={{ background: 'var(--graphite)', color: 'white' }}>
                      Live demo ↗
                    </a>
                  )}
                  {p.github && p.github !== '#' && (
                    <a href={p.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-display font-semibold text-sm px-7 py-3.5 rounded-full border" style={{ borderColor: 'var(--border-strong)', color: 'var(--foreground)' }}>
                      Source ↗
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          {!!p.images?.length && (
            <div className="mt-16 md:mt-20">
              <div className="cin-kicker">Gallery</div>
              <ProjectLightbox images={p.images} title={p.title} />
            </div>
          )}

          {/* Next / prev */}
          <div className="mt-16 md:mt-20 border-t pt-10" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between gap-6">
              {prev ? (
                <Link href={`/work/${prev.slug}`} className="cin-panel p-6 md:p-7 cin-hoverlift w-full" style={{ maxWidth: 520 }}>
                  <div className="cin-kicker">Previous</div>
                  <div className="mt-3 font-display font-black text-2xl" style={{ color: 'var(--foreground)' }}>
                    {prev.title}
                  </div>
                  <div className="mt-2 font-sans text-sm" style={{ color: 'var(--lavender)' }}>
                    {prev.subtitle}
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link href={`/work/${next.slug}`} className="cin-panel p-6 md:p-7 cin-hoverlift w-full text-right" style={{ maxWidth: 520, marginLeft: 'auto' }}>
                  <div className="cin-kicker" style={{ justifyContent: 'flex-end' }}>
                    Next
                  </div>
                  <div className="mt-3 font-display font-black text-2xl" style={{ color: 'var(--foreground)' }}>
                    {next.title}
                  </div>
                  <div className="mt-2 font-sans text-sm" style={{ color: 'var(--lavender)' }}>
                    {next.subtitle}
                  </div>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

