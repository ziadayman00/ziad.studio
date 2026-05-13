type BadgeProps = {
  children: React.ReactNode
  variant?: 'coral' | 'blue' | 'lavender' | 'default'
  className?: string
}

export default function Badge({
  children,
  variant = 'default',
  className = '',
}: BadgeProps) {
  const variants = {
    coral: 'bg-[var(--coral)]/10 text-[var(--coral)] border-[var(--coral)]/20',
    blue: 'bg-[var(--blue)]/10 text-[var(--blue)] border-[var(--blue)]/20',
    lavender: 'bg-[var(--lavender)]/10 text-[var(--lavender)] border-[var(--lavender)]/20',
    default: 'bg-[var(--surface-secondary)] text-[var(--lavender)] border-[var(--border)]',
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-sans tracking-widest uppercase border rounded-full px-3 py-1 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}