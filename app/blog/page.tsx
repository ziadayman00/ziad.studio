import { MarketingAtmosphere } from '@/components/marketing/MarketingAtmosphere'

export const metadata = {
  title: 'Blog — Ziad',
  description: 'Thoughts on creative development, systems, and motion.',
}

const notes = [
  {
    title: 'Designing calm interfaces with cinematic pacing',
    tag: 'Interaction',
    dek: 'Why restraint reads as luxury — and how to choreograph attention without shouting.',
  },
  {
    title: 'How I structure Next.js projects for scale',
    tag: 'Engineering',
    dek: 'Boundaries between server data, client islands, and design tokens that survive growth.',
  },
  {
    title: 'Motion without noise: principles I follow',
    tag: 'Motion',
    dek: 'Curves, overlap, and exit intent — the small rules that keep animation from becoming decoration.',
  },
]

export default function BlogPage() {
  const [lead, ...rest] = notes

  return (
    <section className="cin-section relative overflow-hidden">
      <MarketingAtmosphere tone="light" />

      <div className="cin-container cin-space pt-28 md:pt-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="cin-kicker">Blog</div>
            <h1 className="cin-headline mt-6" style={{ fontSize: 'clamp(2.85rem, 7vw, 6.2rem)' }}>
              Notes from
              <br />
              the
              <span style={{ color: 'var(--coral)' }}> studio</span>.
            </h1>
            <p className="cin-body mt-8 max-w-md text-sm md:text-base">
              Long-form pieces are in the works. For now, this shelf holds the topics I’m writing toward — signal over noise.
            </p>
            <div
              className="mt-10 hidden h-px w-24 lg:block"
              style={{
                background: 'linear-gradient(90deg, var(--coral), transparent)',
              }}
            />
          </div>

          <div className="relative lg:col-span-7">
            <div
              className="pointer-events-none absolute -left-4 top-0 hidden h-full w-px lg:block"
              style={{ background: 'linear-gradient(180deg, var(--border-strong), transparent 85%)' }}
            />

            {/* Lead card */}
            <article
              className="cin-panel relative overflow-hidden p-8 md:p-10 cin-hoverlift"
              style={{ boxShadow: '0 32px 100px rgba(0,0,0,0.07)' }}
            >
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl opacity-60"
                style={{ background: 'radial-gradient(circle, rgba(255,122,89,0.2) 0%, transparent 70%)' }}
              />
              <div className="relative flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[color-mix(in_srgb,var(--coral)_12%,transparent)] px-3 py-1 font-sans text-[10px] font-semibold tracking-[0.16em] text-[var(--coral-dark)] uppercase">
                  Featured
                </span>
                <span className="font-sans text-xs tracking-[0.2em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)] uppercase">{lead.tag}</span>
              </div>
              <h2 className="relative mt-5 font-display text-2xl font-black leading-tight tracking-tight text-[var(--foreground)] md:text-3xl">
                {lead.title}
              </h2>
              <p className="relative mt-4 font-sans text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_55%,var(--lavender))] md:text-[15px]">
                {lead.dek}
              </p>
              <p className="relative mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.14em] text-[var(--lavender)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--coral)]" />
                Draft in progress
              </p>
            </article>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {rest.map((n) => (
                <article
                  key={n.title}
                  className="cin-panel relative overflow-hidden p-6 cin-hoverlift"
                  style={{ borderRadius: '20px' }}
                >
                  <span className="font-sans text-[10px] tracking-[0.2em] text-[color-mix(in_srgb,var(--lavender)_88%,transparent)] uppercase">{n.tag}</span>
                  <h3 className="mt-3 font-display text-xl font-black leading-snug tracking-tight text-[var(--foreground)]">{n.title}</h3>
                  <p className="mt-3 font-sans text-xs leading-relaxed text-[color-mix(in_srgb,var(--foreground)_50%,var(--lavender))]">{n.dek}</p>
                  <p className="mt-5 font-mono text-[10px] tracking-[0.12em] text-[var(--lavender)]">Coming soon</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
