import Link from 'next/link'

import { MarketingAtmosphere } from '@/components/marketing/MarketingAtmosphere'

const process = [
  {
    n: '01',
    title: 'Frame',
    text: 'Goals, constraints, references, and what “done” means for your audience — locked before pixels move.',
  },
  {
    n: '02',
    title: 'Shape',
    text: 'Structure, systems, and motion language sketched so engineering and design share one map.',
  },
  {
    n: '03',
    title: 'Build',
    text: 'Production-quality UI with performance budgets, accessibility guardrails, and reviewable milestones.',
  },
  {
    n: '04',
    title: 'Polish',
    text: 'Pacing, micro-interactions, and edge cases — the layer that separates shipped from crafted.',
  },
]

const services = [
  {
    tag: 'Build',
    title: 'Creative development',
    lead: 'Frontend that carries the design — fast, maintainable, and intentional about motion.',
    bullets: [
      'Next.js / React apps, marketing sites, and internal tools',
      'Performance budgets, Core Web Vitals, and lazy media strategy',
      'Animation and scroll choreography tied to real layout',
      'Handoff-friendly code structure for your team or contractors',
    ],
  },
  {
    tag: 'Systems',
    title: 'UI systems',
    lead: 'A shared language for product teams so interfaces stay coherent as they grow.',
    bullets: [
      'Tokens, type scale, spacing, and states mapped to components',
      'Documentation your designers and engineers will actually use',
      'Theming for light/dark or multi-brand without duplication',
      'Governance patterns: naming, versioning, contribution flow',
    ],
  },
  {
    tag: 'Motion',
    title: 'Interaction direction',
    lead: 'Motion as product behavior — not decoration layered on at the end.',
    bullets: [
      'Easing, overlap, and hierarchy tuned to your brand pace',
      'Reduced-motion paths that stay dignified, not stripped',
      'Specs handoff: durations, delays, and “why” for engineers',
      'Review of existing UI for noise, drift, and missed affordances',
    ],
  },
]

const engagements = [
  { label: 'Project', hint: 'Defined scope, milestones, delivery' },
  { label: 'Sprint block', hint: 'Short burst for launch or refactor' },
  { label: 'Advisory', hint: 'Architecture, motion, or design-system counsel' },
]

export const metadata = {
  title: 'Services — Ziad',
  description: 'Creative development, UI systems, and interaction direction.',
}

export default function ServicesPage() {
  return (
    <div className="relative">
      {/* Light — editorial intro + process */}
      <section className="cin-section relative overflow-hidden">
        <MarketingAtmosphere tone="light" />

        <div className="cin-container cin-space pt-28 md:pt-32 pb-16 md:pb-24">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16 lg:items-end">
            <div className="lg:col-span-7 min-w-0">
              <div className="cin-kicker">Services</div>
              <h1 className="cin-headline mt-6" style={{ fontSize: 'clamp(2.85rem, 7vw, 6.2rem)' }}>
                Capabilities built
                <br />
                for serious
                <span style={{ color: 'var(--coral)' }}> interfaces</span>.
              </h1>
              <p className="cin-body mt-8 max-w-xl text-base md:text-lg">
                I work as a creative developer: the overlap where layout, motion, and frontend engineering have to agree.
                Below is how engagements are structured — then what you can hire for.
              </p>
            </div>
            <div className="lg:col-span-5">
              <div className="cin-panel relative overflow-hidden p-7 md:p-8">
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl opacity-50"
                  style={{ background: 'radial-gradient(circle, rgba(255,122,89,0.25) 0%, transparent 70%)' }}
                />
                <p className="font-mono text-[10px] tracking-[0.28em] text-[color-mix(in_srgb,var(--lavender)_90%,transparent)] uppercase">
                  How we work
                </p>
                <p className="mt-4 font-sans text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_55%,var(--lavender))]">
                  Clear phases, async-friendly reviews, and written decisions so nobody is guessing what changed or why.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {engagements.map((e) => (
                    <span
                      key={e.label}
                      className="rounded-full border border-[var(--border-strong)] bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] px-3 py-1.5 text-left"
                      title={e.hint}
                    >
                      <span className="block font-display text-xs font-bold text-[var(--foreground)]">{e.label}</span>
                      <span className="mt-0.5 block font-sans text-[10px] leading-tight text-[var(--lavender)]">{e.hint}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Process */}
          <div className="mt-16 md:mt-24">
            <div className="cin-kicker mb-8">Process</div>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {process.map((p) => (
                <div key={p.n} className="relative border-l-2 border-[color-mix(in_srgb,var(--coral)_45%,var(--border))] pl-5">
                  <span className="font-mono text-xs tracking-[0.2em] text-[var(--coral)]">{p.n}</span>
                  <h2 className="mt-3 font-display text-lg font-black tracking-tight text-[var(--foreground)] md:text-xl">{p.title}</h2>
                  <p className="mt-2 font-sans text-xs leading-relaxed text-[var(--lavender)] md:text-sm">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Light — offerings as full-width editorial blocks (not generic cards) */}
      <section className="cin-section relative border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-secondary)_55%,var(--background))]">
        <div className="cin-container py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="cin-kicker">Offerings</div>
            <p className="cin-body mt-4 text-sm md:text-base">
              Each line below is something clients explicitly ask for — not a laundry list of buzzwords.
            </p>
          </div>

          <div className="mt-12 space-y-6 md:mt-16 md:space-y-8">
            {services.map((s, i) => (
              <article
                key={s.title}
                className="group relative overflow-hidden rounded-[24px] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-7 shadow-[0_20px_70px_rgba(0,0,0,0.04)] transition-[border-color,box-shadow] duration-700 ease-[var(--ease-out-expo)] hover:border-[color-mix(in_srgb,var(--coral)_22%,var(--border))] md:p-9"
              >
                <div
                  className="pointer-events-none absolute bottom-0 right-0 h-48 w-48 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                  style={{
                    background:
                      i === 0
                        ? 'radial-gradient(circle, rgba(255,122,89,0.18) 0%, transparent 70%)'
                        : i === 1
                          ? 'radial-gradient(circle, rgba(110,168,254,0.16) 0%, transparent 70%)'
                          : 'radial-gradient(circle, rgba(141,139,167,0.2) 0%, transparent 70%)',
                  }}
                />
                <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10 lg:items-start">
                  <div className="flex items-start gap-5 lg:col-span-4">
                    <span
                      className="mt-1 hidden h-12 w-1 shrink-0 rounded-full sm:block"
                      style={{
                        background:
                          i === 0 ? 'var(--coral)' : i === 1 ? 'var(--blue)' : 'var(--lavender)',
                      }}
                      aria-hidden
                    />
                    <div>
                      <span className="inline-flex rounded-full border border-[var(--border-strong)] px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-[var(--lavender)] uppercase">
                        {s.tag}
                      </span>
                      <h2 className="mt-4 font-display text-2xl font-black tracking-tight text-[var(--foreground)] md:text-3xl">{s.title}</h2>
                      <p className="mt-3 font-sans text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_58%,var(--lavender))] md:text-[15px]">
                        {s.lead}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-3 border-t border-[var(--border)] pt-8 font-sans text-sm leading-relaxed text-[var(--foreground)] lg:col-span-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--coral)]" aria-hidden />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Graphite — single focused CTA (matches site accent strips, not a whole generic dark page) */}
      <section className="relative overflow-hidden py-16 md:py-20" style={{ background: 'var(--graphite)' }}>
        <MarketingAtmosphere tone="dark" />
        <div className="cin-container relative">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase" style={{ color: 'rgba(255,255,255,0.32)' }}>
              Next step
            </p>
            <p className="mt-4 font-display text-2xl font-black leading-tight tracking-tight text-white md:text-3xl">
              Send the messy brief — timeline, links, and what keeps you up at night.
            </p>
            <p className="mt-4 font-sans text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
              You’ll get a straight answer on fit, a suggested shape for the work, and what I need from you to start.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--coral)] px-10 py-4 font-display text-sm font-semibold text-white shadow-[0_18px_55px_rgba(255,122,89,0.28)] transition-[transform,filter] duration-500 ease-[var(--ease-out-expo)] hover:brightness-110 active:scale-[0.98]"
            >
              Open a conversation
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
