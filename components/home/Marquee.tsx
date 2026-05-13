'use client'

type MarqueeProps = {
  dark?: boolean
}

const items = [
  'Design',
  '✦',
  'Development',
  '◎',
  'Storytelling',
  '✦',
  'React',
  '◎',
  'Next.js',
  '✦',
  'UI/UX',
  '◎',
  'Branding',
  '✦',
  'Motion',
  '◎',
  'TypeScript',
  '✦',
]

export default function Marquee({ dark = false }: MarqueeProps) {
  const repeated = [...items, ...items, ...items]

  return (
    <div
      className="overflow-hidden py-5 border-y marquee-mask"
      style={{
        background: dark ? 'rgba(31,31,36,0.98)' : 'rgba(247,247,242,1)',
        borderColor: dark ? 'rgba(255,255,255,0.08)' : 'var(--border)',
      }}
    >
      <div
        className="flex items-center whitespace-nowrap marquee-track"
        style={{
          animation: 'marquee 36s linear infinite',
        }}
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="font-display font-black text-sm tracking-widest uppercase mx-6"
            style={{
              color:
                item === '✦' || item === '◎'
                  ? 'var(--coral)'
                  : dark
                    ? 'rgba(255,255,255,0.22)'
                    : 'rgba(31,31,36,0.22)',
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
