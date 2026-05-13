import { MarketingAtmosphere } from '@/components/marketing/MarketingAtmosphere'

export const metadata = {
  title: 'About — Ziad',
  description: 'Creative developer building cinematic digital experiences.',
}

const pillars = [
  { n: '01', title: 'Pace', body: 'Motion and layout rhythm tuned so nothing feels accidental or rushed.' },
  { n: '02', title: 'Clarity', body: 'Complex systems presented with hierarchy you can scan in seconds.' },
  { n: '03', title: 'Tactility', body: 'Interfaces that respond like physical objects — weight, depth, feedback.' },
]

export default function AboutPage() {
  return (
    <section className="cin-section relative overflow-hidden">
      <MarketingAtmosphere tone="light" />

      <div className="cin-container cin-space pt-28 md:pt-32">
        <div className="grid grid-cols-1 items-end gap-10 xl:grid-cols-12 xl:gap-14">
          <div className="relative min-w-0 xl:col-span-7">
            <div className="cin-kicker">About</div>
            <h1
              className="cin-headline mt-6"
              style={{ fontSize: 'clamp(2.85rem, 7.2vw, 6.6rem)', color: 'var(--foreground)' }}
            >
              Building digital
              <br />
              products with
              <span style={{ color: 'var(--coral)' }}> intention</span>.
            </h1>
            <p className="cin-body mt-8 max-w-2xl text-base md:text-lg">
              I’m Ziad — a creative developer who cares about how software <em>feels</em> in the hand. Frontend architecture,
              visual direction, and interaction quality share one goal: experiences that read as crafted, not shipped.
            </p>
          </div>

          <div className="relative min-w-0 xl:col-span-5">
            <div
              className="cin-panel relative overflow-hidden p-7 md:p-8"
              style={{
                boxShadow: '0 28px 100px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.65)',
              }}
            >
              <div
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl opacity-70"
                style={{ background: 'radial-gradient(circle, rgba(255,122,89,0.35) 0%, transparent 70%)' }}
              />
              <div className="relative flex items-center justify-between gap-4">
                <span className="font-sans text-xs tracking-[0.22em] text-[color-mix(in_srgb,var(--lavender)_85%,transparent)] uppercase">
                  Profile
                </span>
                <img src="/assets/me.png" alt="Ziad" className="h-12 w-12 rounded-full object-cover ring-2 ring-white/80 shadow-lg" />
              </div>
              <div className="relative mt-8 grid grid-cols-2 gap-6 border-t border-[var(--border)] pt-8">
                <div>
                  <span className="font-sans text-[10px] tracking-[0.2em] text-[color-mix(in_srgb,var(--lavender)_85%,transparent)] uppercase">
                    Base
                  </span>
                  <div className="font-display mt-2 text-2xl font-black tracking-tight">Egypt</div>
                </div>
                <div>
                  <span className="font-sans text-[10px] tracking-[0.2em] text-[color-mix(in_srgb,var(--lavender)_85%,transparent)] uppercase">
                    Focus
                  </span>
                  <div className="font-display mt-2 text-2xl font-black tracking-tight">Web experiences</div>
                </div>
              </div>
              <p className="relative mt-6 font-sans text-sm leading-relaxed text-[color-mix(in_srgb,var(--foreground)_72%,var(--lavender))]">
                Currently taking a limited set of collaborations — especially product teams who want a signature digital surface.
              </p>
            </div>
          </div>
        </div>

        {/* Principles */}
        <div className="relative mt-20 md:mt-28">
          <div className="cin-kicker mb-10">Operating model</div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
            {pillars.map((p) => (
              <article
                key={p.n}
                className="group relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_94%,transparent)] p-7 transition-[border-color,box-shadow,transform] duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--coral)_28%,var(--border))] hover:shadow-[0_28px_90px_rgba(0,0,0,0.08)]"
              >
                <span className="font-mono text-[11px] tracking-[0.18em] text-[var(--coral)]">{p.n}</span>
                <h2 className="font-display mt-4 text-2xl font-black tracking-tight text-[var(--foreground)]">{p.title}</h2>
                <p className="cin-body mt-3 text-sm">{p.body}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Pull quote strip */}
        <div
          className="relative mt-20 overflow-hidden rounded-3xl border md:mt-28"
          style={{
            borderColor: 'rgba(31,31,36,0.12)',
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--graphite) 94%, transparent) 0%, color-mix(in srgb, var(--graphite) 88%, #2a2a32) 100%)',
            boxShadow: '0 40px 120px rgba(0,0,0,0.12)',
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background: 'radial-gradient(600px 280px at 12% 40%, rgba(255,122,89,0.2) 0%, transparent 60%)',
            }}
          />
          <div className="relative grid grid-cols-1 gap-8 p-8 md:grid-cols-12 md:items-center md:p-12">
            <div className="font-mono text-[10px] tracking-[0.35em] text-white/35 md:col-span-3">Manifesto</div>
            <blockquote className="font-display text-2xl font-black leading-[1.15] tracking-tight text-white md:col-span-9 md:text-3xl lg:text-[2.15rem]">
              The best interfaces don’t announce themselves — they <span style={{ color: 'var(--coral)' }}>pull you in</span>, then get out of the way.
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
