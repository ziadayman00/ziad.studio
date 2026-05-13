type Tone = 'light' | 'dark'

/** Full-bleed ambient layers for marketing routes — keep pages visually aligned with the rest of the site. */
export function MarketingAtmosphere({ tone }: { tone: Tone }) {
  if (tone === 'dark') {
    return (
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div
          className="absolute -top-[18%] right-[-8%] h-[72%] w-[58%] rounded-full blur-[120px] opacity-[0.38]"
          style={{
            background: 'radial-gradient(circle at 40% 40%, rgba(255,122,89,0.45) 0%, rgba(255,122,89,0.08) 45%, transparent 72%)',
          }}
        />
        <div
          className="absolute bottom-[-12%] left-[-12%] h-[56%] w-[52%] rounded-full blur-[110px] opacity-[0.28]"
          style={{
            background: 'radial-gradient(circle at 35% 55%, rgba(110,168,254,0.35) 0%, transparent 68%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            background:
              'radial-gradient(ellipse 90% 55% at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 55%), radial-gradient(ellipse 80% 50% at 80% 100%, rgba(255,255,255,0.04) 0%, transparent 50%)',
          }}
        />
        <div className="absolute inset-0 intro-grain opacity-[0.22]" />
      </div>
    )
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="absolute -top-[8%] right-[-6%] h-[62%] w-[48%] rounded-full blur-[100px] opacity-[0.55]"
        style={{
          background: 'radial-gradient(circle at 42% 42%, rgba(255,122,89,0.22) 0%, rgba(255,122,89,0.06) 50%, transparent 72%)',
        }}
      />
      <div
        className="absolute top-[40%] -left-[8%] h-[48%] w-[44%] rounded-full blur-[90px] opacity-[0.45]"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(110,168,254,0.18) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          background:
            'radial-gradient(ellipse 120% 80% at 50% 100%, rgba(141,139,167,0.08) 0%, transparent 55%)',
        }}
      />
      <div className="absolute inset-0 intro-grain opacity-[0.14]" />
    </div>
  )
}
