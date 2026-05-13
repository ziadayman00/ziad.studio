import { MarketingAtmosphere } from '@/components/marketing/MarketingAtmosphere'

export const metadata = {
  title: 'Contact — Ziad',
  description: 'Start a project with Ziad.',
}

export default function ContactPage() {
  return (
    <section className="cin-section relative overflow-hidden">
      <MarketingAtmosphere tone="light" />

      <div className="cin-container cin-space pt-28 md:pt-32">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="cin-kicker">Contact</div>
            <h1
              className="cin-headline mt-6"
              style={{ fontSize: 'clamp(2.85rem, 7.2vw, 6.3rem)', color: 'var(--foreground)' }}
            >
              Let’s build something
              <br />
              worth
              <span style={{ color: 'var(--coral)' }}> remembering</span>.
            </h1>
            <p className="cin-body mt-8 max-w-lg text-base md:text-lg">
              Tell me about the product, the audience, and what “done” looks like. I’ll reply with honest fit, a suggested arc,
              and what I need from you to move fast.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <span
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 font-sans text-xs"
                style={{ borderColor: 'var(--border-strong)', color: 'var(--lavender)' }}
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--coral)]" />
                Accepting Q2 collaborations
              </span>
            </div>
          </div>

          <div className="relative lg:col-span-6">
            <div
              className="pointer-events-none absolute -inset-4 rounded-[32px] opacity-70 blur-2xl"
              style={{
                background: 'radial-gradient(ellipse at 30% 20%, rgba(255,122,89,0.12) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(110,168,254,0.1) 0%, transparent 50%)',
              }}
            />
            <div
              className="cin-panel relative overflow-hidden p-8 md:p-10"
              style={{ boxShadow: '0 36px 110px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)' }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.28em] text-[var(--lavender)] uppercase">Direct line</p>
                  <p className="mt-2 font-display text-lg font-bold text-[var(--foreground)]">Email &amp; links</p>
                </div>
                <div
                  className="hidden h-12 w-12 shrink-0 rounded-2xl border sm:flex sm:items-center sm:justify-center"
                  style={{ borderColor: 'var(--border)', background: 'var(--surface-secondary)' }}
                  aria-hidden
                >
                  <span className="text-lg" style={{ color: 'var(--coral)' }}>
                    ↗
                  </span>
                </div>
              </div>

              <p className="cin-body mt-6 text-sm md:text-base">
                Prefer email for first contact — it keeps threads easy to reference when we scope milestones and creative direction.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="mailto:ziad.ayman.dev@gmail.com"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[var(--graphite)] px-8 py-4 font-display text-sm font-semibold text-white shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition-[transform,filter] duration-500 ease-[var(--ease-out-expo)] hover:brightness-110 active:scale-[0.98] sm:flex-initial"
                >
                  ziad.ayman.dev@gmail.com
                  <span aria-hidden className="text-white/50">
                    ↗
                  </span>
                </a>
                <a
                  href="https://github.com/ziadayman00"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border px-8 py-4 font-display text-sm font-semibold transition-[border-color,background-color] duration-500 ease-[var(--ease-out-expo)]"
                  style={{ borderColor: 'var(--border-strong)', color: 'var(--foreground)' }}
                >
                  GitHub
                  <span className="text-[var(--lavender)]" aria-hidden>
                    ↗
                  </span>
                </a>
              </div>

              <div
                className="mt-10 rounded-2xl border p-5 font-mono text-[11px] leading-relaxed"
                style={{
                  borderColor: 'var(--border)',
                  background: 'color-mix(in srgb, var(--surface-secondary) 88%, transparent)',
                  color: 'color-mix(in srgb, var(--lavender) 92%, var(--foreground))',
                }}
              >
                <span style={{ color: 'var(--coral)' }}>$</span> reply_time — typically under 48h · include budget band if you can
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
