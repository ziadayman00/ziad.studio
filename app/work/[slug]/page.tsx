import { notFound } from 'next/navigation'
import Link from 'next/link'

import ProjectLightbox from '@/components/work/ProjectLightbox'
import { getProjects } from '@/lib/projects'

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
  const sceneNo = String(index + 1).padStart(2, '0')
  const sceneTotal = String(projects.length).padStart(2, '0')

  return (
    <div className="relative">
      {/* Opening frame — atmosphere matches marketing / work index */}
      <section className="relative overflow-hidden cin-section">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(820px 620px at 70% 18%, color-mix(in srgb, ${p.color} 18%, transparent) 0%, transparent 58%), radial-gradient(720px 520px at 12% 85%, color-mix(in srgb, var(--blue) 12%, transparent) 0%, transparent 65%), linear-gradient(180deg, var(--background) 0%, color-mix(in srgb, var(--background) 88%, var(--surface-secondary)) 50%, var(--background) 100%)`,
          }}
        />
        <div className="pointer-events-none absolute inset-0 intro-grain opacity-[0.28]" />

        <div className="cin-container relative pb-6 pt-28 md:pb-8 md:pt-32">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_82%,transparent)] px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-[8px] transition-all duration-500 ease-[var(--ease-out-expo)] hover:border-[color-mix(in_srgb,var(--coral)_35%,var(--border))] hover:text-[var(--foreground)]"
            >
              <span className="text-[var(--coral)]" aria-hidden>
                ←
              </span>
              Archive
            </Link>
            <div className="flex items-center gap-3">
              <span
                className="hidden font-mono text-[10px] font-medium uppercase tracking-[0.32em] text-[var(--foreground-muted)] sm:block"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                scene {sceneNo}/{sceneTotal}
              </span>
              <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)]/90 px-3 py-1.5 backdrop-blur-sm">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color }} />
                <span className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--foreground-muted)]">
                  {p.category}
                </span>
                <span className="font-mono text-[11px] tabular-nums text-[var(--foreground-muted)] opacity-75">
                  {p.year}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 items-end gap-10 xl:grid-cols-12 xl:gap-12">
            <div className="min-w-0 xl:col-span-8">
              <div className="cin-kicker">Case study</div>
              <h1
                className="cin-headline mt-5 text-[clamp(2.6rem,7vw,6.2rem)]"
                style={{ color: 'var(--foreground)' }}
              >
                {p.title}
              </h1>
              <p className="cin-body mt-5 max-w-3xl text-base md:text-lg">{p.subtitle}</p>
            </div>
            <div className="min-w-0 xl:col-span-4">
              <div
                className="cin-panel relative overflow-hidden p-6 md:p-7"
                style={{
                  borderLeftWidth: 4,
                  borderLeftColor: p.color,
                }}
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-30 blur-3xl" style={{ background: p.color }} />
                <div className="relative flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-[var(--foreground-muted)]">
                    Artifact note
                  </span>
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color }} />
                </div>
                <p className="cin-body relative mt-4 text-sm leading-relaxed md:text-[15px]">{p.longDescription}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--foreground-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
              >
                {t}
              </span>
            ))}
            {p.inProgress && (
              <span className="rounded-full border border-[color-mix(in_srgb,var(--coral)_35%,var(--border))] bg-[color-mix(in_srgb,var(--coral)_8%,transparent)] px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--coral)]">
                In progress
              </span>
            )}
            {p.comingSoon && (
              <span className="rounded-full border border-[color-mix(in_srgb,var(--blue)_30%,var(--border))] bg-[color-mix(in_srgb,var(--blue)_8%,transparent)] px-3 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--blue)]">
                Coming soon
              </span>
            )}
          </div>
        </div>

        {/* Hero media — cinematic gate */}
        <div className="cin-container pb-16 md:pb-20">
          <div
            className="relative overflow-hidden rounded-[clamp(1.25rem,3vw,2rem)] border border-[var(--border)] bg-[var(--surface-secondary)] shadow-[0_32px_100px_rgba(12,12,18,0.12)]"
            style={{
              boxShadow: `0 32px 100px rgba(12,12,18,0.1), 0 0 0 1px color-mix(in srgb, ${p.color} 22%, var(--border))`,
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{
                background: `radial-gradient(900px 520px at 72% 22%, color-mix(in srgb, ${p.color} 28%, transparent) 0%, transparent 58%), linear-gradient(180deg, rgba(12,12,18,0.05) 0%, rgba(12,12,18,0.12) 100%)`,
              }}
            />
            <img
              src={heroImage}
              alt={`${p.title} hero`}
              className="relative z-0 w-full object-cover object-top"
              style={{ height: 'clamp(320px, 52vw, 640px)' }}
            />
            <div className="pointer-events-none absolute inset-0 z-[2] intro-grain opacity-[0.2]" />
            <div className="absolute bottom-4 left-4 right-4 z-[3] flex items-end justify-between gap-3 md:bottom-6 md:left-6 md:right-6">
              <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm">
                Key frame
              </span>
              <span className="font-display text-2xl font-black tabular-nums text-white/25 md:text-3xl" aria-hidden>
                {sceneNo}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Scene body */}
      <section className="cin-section bg-[color-mix(in_srgb,var(--surface-secondary)_55%,var(--background))]">
        <div className="cin-container cin-space pt-14 md:pt-16">
          <div className="grid grid-cols-1 items-start gap-12 xl:grid-cols-12 xl:gap-14">
            <div className="min-w-0 xl:col-span-7">
              <div className="cin-kicker">Overview</div>
              <h2 className="cin-headline mt-5 text-[clamp(2rem,4.5vw,3.4rem)]">
                What it{' '}
                <span style={{ color: 'var(--coral)' }}>is</span>.
              </h2>
              <p className="cin-body mt-6 text-base md:text-lg">{p.description}</p>

              {!!p.features?.length && (
                <div className="mt-14 md:mt-16">
                  <div className="cin-kicker">Signals</div>
                  <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                    {p.features.map((f, fi) => (
                      <div
                        key={f}
                        className="group cin-panel relative overflow-hidden p-5 transition-shadow duration-500 ease-[var(--ease-out-expo)] hover:shadow-[0_20px_60px_rgba(12,12,18,0.08)] md:p-6"
                      >
                        <div
                          className="absolute left-0 top-0 h-full w-0.5 opacity-80 transition-all duration-500 group-hover:w-1"
                          style={{ background: p.color }}
                        />
                        <div className="flex items-start justify-between gap-4 pl-3">
                          <span className="font-mono text-[10px] font-medium tabular-nums text-[var(--foreground-muted)]">
                            {String(fi + 1).padStart(2, '0')}
                          </span>
                          <span className="font-sans text-sm leading-relaxed text-[var(--foreground)] md:text-[15px]">{f}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="min-w-0 xl:col-span-5">
              <div
                className="cin-panel relative overflow-hidden p-7 md:p-8 xl:sticky xl:top-28"
                style={{
                  borderTopWidth: 3,
                  borderTopColor: p.color,
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.55), 0 24px 70px rgba(12,12,18,0.06), 0 -3px 0 0 color-mix(in srgb, ${p.color} 55%, transparent)`,
                }}
              >
                <div className="pointer-events-none absolute -right-16 top-24 h-56 w-56 rounded-full opacity-25 blur-3xl" style={{ background: p.color }} />

                <div className="relative flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-[var(--foreground-muted)]">
                    Scene data
                  </span>
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: p.color }} />
                </div>

                <div className="relative mt-7 grid grid-cols-2 gap-5">
                  <div>
                    <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                      Year
                    </span>
                    <div className="mt-1.5 font-display text-xl font-bold tabular-nums tracking-tight text-[var(--foreground)]">
                      {p.year}
                    </div>
                  </div>
                  <div>
                    <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                      Sector
                    </span>
                    <div className="mt-1.5 font-display text-xl font-bold tracking-tight text-[var(--foreground)]">{p.category}</div>
                  </div>
                  {p.responsibility && (
                    <div className="col-span-2 border-t border-[var(--border)] pt-5">
                      <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                        Responsibility
                      </span>
                      <div className="cin-body mt-2 text-sm">{p.responsibility}</div>
                    </div>
                  )}
                  {p.impact && (
                    <div className="col-span-2 border-t border-[var(--border)] pt-5">
                      <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--foreground-muted)]">
                        Impact
                      </span>
                      <div className="mt-2 font-display text-lg font-bold text-[var(--foreground)]">{p.impact}</div>
                    </div>
                  )}
                </div>

                <div className="relative mt-8 border-t border-[var(--border)] pt-6">
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.26em] text-[var(--foreground-muted)]">
                    Stack
                  </span>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={`stack-${t}`}
                        className="rounded-full border border-[var(--border)] bg-[var(--surface-secondary)] px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-[var(--foreground-muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative mt-8 flex flex-wrap gap-3">
                  {p.live && p.live !== '#' && (
                    <a
                      href={p.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[var(--graphite)] px-7 py-3.5 font-display text-sm font-semibold text-white shadow-[0_8px_32px_rgba(12,12,18,0.2)] transition-all duration-500 ease-[var(--ease-out-expo)] hover:bg-[var(--coral)] hover:shadow-[0_12px_40px_color-mix(in_srgb,var(--coral)_35%,transparent)]"
                    >
                      Live demo <span aria-hidden>↗</span>
                    </a>
                  )}
                  {p.github && p.github !== '#' && (
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--surface)] px-7 py-3.5 font-display text-sm font-semibold text-[var(--foreground)] transition-all duration-500 ease-[var(--ease-out-expo)] hover:border-[var(--coral)] hover:text-[var(--coral)]"
                    >
                      Source <span aria-hidden>↗</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {!!p.images?.length && (
            <div className="mt-16 md:mt-20">
              <div className="cin-kicker">Gallery</div>
              <p className="cin-body mt-3 max-w-lg text-sm">Full-bleed frames — click any tile to open the lightbox.</p>
              <ProjectLightbox images={p.images} title={p.title} accentColor={p.color} />
            </div>
          )}

          <div className="mt-16 border-t border-[var(--border)] pt-12 md:mt-20 md:pt-14">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {prev ? (
                <Link
                  href={`/work/${prev.slug}`}
                  className="group cin-panel relative flex gap-5 overflow-hidden p-6 transition-all duration-500 ease-[var(--ease-out-expo)] hover:border-[color-mix(in_srgb,var(--coral)_28%,var(--border))] hover:shadow-[0_24px_70px_rgba(12,12,18,0.1)] md:p-7"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] md:h-28 md:w-28">
                    <img
                      src={prev.images?.[0] ?? '/assets/hero-poster.jpg'}
                      alt=""
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="cin-kicker">Previous scene</div>
                    <div className="mt-2 font-display text-xl font-bold leading-tight tracking-[-0.02em] text-[var(--foreground)] transition-colors duration-300 group-hover:text-[var(--coral)] md:text-2xl">
                      {prev.title}
                    </div>
                    <p className="cin-body mt-2 line-clamp-2 text-sm">{prev.subtitle}</p>
                  </div>
                  <span className="absolute right-4 top-4 font-display text-lg text-[var(--coral)] opacity-0 transition-all duration-500 group-hover:opacity-100 md:right-5 md:top-5" aria-hidden>
                    ↖
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {next ? (
                <Link
                  href={`/work/${next.slug}`}
                  className="group cin-panel relative flex flex-row-reverse gap-5 overflow-hidden p-6 text-right transition-all duration-500 ease-[var(--ease-out-expo)] hover:border-[color-mix(in_srgb,var(--coral)_28%,var(--border))] hover:shadow-[0_24px_70px_rgba(12,12,18,0.1)] md:p-7"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-secondary)] md:h-28 md:w-28">
                    <img
                      src={next.images?.[0] ?? '/assets/hero-poster.jpg'}
                      alt=""
                      className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                  <div className="flex justify-end">
                    <div className="cin-kicker">Next scene</div>
                  </div>
                    <div className="mt-2 font-display text-xl font-bold leading-tight tracking-[-0.02em] text-[var(--foreground)] transition-colors duration-300 group-hover:text-[var(--coral)] md:text-2xl">
                      {next.title}
                    </div>
                    <p className="cin-body mt-2 line-clamp-2 text-sm">{next.subtitle}</p>
                  </div>
                  <span className="absolute left-4 top-4 font-display text-lg text-[var(--coral)] opacity-0 transition-all duration-500 group-hover:opacity-100 md:left-5 md:top-5" aria-hidden>
                    ↗
                  </span>
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
