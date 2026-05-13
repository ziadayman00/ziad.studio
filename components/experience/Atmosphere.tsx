'use client'

import { useEffect, useRef } from 'react'

export default function Atmosphere() {
  const rafRef = useRef<number | null>(null)
  const targetRef = useRef({ x: 0.5, y: 0.35 })
  const currentRef = useRef({ x: 0.5, y: 0.35 })

  useEffect(() => {
    const setVars = (x: number, y: number) => {
      document.documentElement.style.setProperty('--cursor-x', `${(x * 100).toFixed(3)}%`)
      document.documentElement.style.setProperty('--cursor-y', `${(y * 100).toFixed(3)}%`)
    }

    const onMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX / Math.max(1, window.innerWidth)
      targetRef.current.y = e.clientY / Math.max(1, window.innerHeight)
    }

    const tick = () => {
      const c = currentRef.current
      const t = targetRef.current
      c.x += (t.x - c.x) * 0.06
      c.y += (t.y - c.y) * 0.06
      setVars(c.x, c.y)
      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    setVars(currentRef.current.x, currentRef.current.y)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 atmosphere-base" />
      <div className="absolute inset-0 atmosphere-cursor" />
      <div className="absolute inset-0 intro-grain opacity-[0.65]" />
    </div>
  )
}

