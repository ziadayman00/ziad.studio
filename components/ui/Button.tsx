'use client'

import Link from 'next/link'

type ButtonProps = {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  className?: string
  type?: 'button' | 'submit'
}

export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 font-display font-semibold text-sm tracking-wide transition-all duration-300 rounded-full px-6 py-3 cursor-pointer select-none'

  const variants = {
    primary:
      'bg-[var(--coral)] text-white hover:bg-[var(--coral-dark)] active:scale-95',
    secondary:
      'bg-[var(--foreground)] text-[var(--background)] hover:opacity-80 active:scale-95',
    ghost:
      'border border-[var(--border-strong)] text-[var(--foreground)] hover:border-[var(--coral)] hover:text-[var(--coral)] active:scale-95',
  }

  const classes = `${base} ${variants[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
        <span className="text-xs">→</span>
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
      <span className="text-xs">→</span>
    </button>
  )
}