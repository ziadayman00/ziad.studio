type SectionLabelProps = {
  number: string
  label: string
  className?: string
}

export default function SectionLabel({ number, label, className = '' }: SectionLabelProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="font-display text-[var(--coral)] text-sm font-semibold">
        {number}
      </span>
      <div className="w-6 h-px bg-[var(--coral)]" />
      <span className="font-sans text-[var(--lavender)] text-xs tracking-widest uppercase">
        {label}
      </span>
    </div>
  )
}