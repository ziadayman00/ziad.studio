'use client'

import { useCallback } from 'react'

type MagneticOptions = {
  strength?: number
}

export function useMagnetic(options: MagneticOptions = {}) {
  const { strength = 10 } = options

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget as HTMLElement
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / Math.max(1, rect.width) - 0.5) * strength
      const y = ((e.clientY - rect.top) / Math.max(1, rect.height) - 0.5) * strength
      el.style.transform = `translate(${x}px, ${y}px)`
    },
    [strength]
  )

  const onLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget as HTMLElement
    el.style.transform = 'translate(0, 0)'
  }, [])

  return { onMove, onLeave }
}

