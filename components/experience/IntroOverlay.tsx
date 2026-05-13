'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type IntroOverlayProps = {
  onDone?: () => void
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export default function IntroOverlay({ onDone }: IntroOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)
  const [phase, setPhase] = useState<'active' | 'fade'>('active')

  const path = useMemo(() => {
    // Normalized points (0..1) for an abstract "Z" trail.
    // Designed to feel like a light gesture rather than a literal letter.
    const pts: Array<[number, number]> = [
      [0.22, 0.34],
      [0.52, 0.30],
      [0.78, 0.32],
      [0.68, 0.46],
      [0.54, 0.58],
      [0.38, 0.70],
      [0.22, 0.78],
      [0.50, 0.74],
      [0.78, 0.70],
    ]
    return pts
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1))
    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    const totalMs = 3600
    const drawMs = 2600
    const fadeMs = 900

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const tRaw = (now - startRef.current) / totalMs
      const t = clamp01(tRaw)

      const w = window.innerWidth
      const h = window.innerHeight

      ctx.clearRect(0, 0, w, h)

      // Background "nearly empty": soft ambient lighting + vignette
      const g1 = ctx.createRadialGradient(w * 0.6, h * 0.35, 0, w * 0.6, h * 0.35, Math.max(w, h) * 0.9)
      g1.addColorStop(0, 'rgba(255, 122, 89, 0.08)')
      g1.addColorStop(0.5, 'rgba(110, 168, 254, 0.05)')
      g1.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, w, h)

      const g2 = ctx.createRadialGradient(w * 0.25, h * 0.7, 0, w * 0.25, h * 0.7, Math.max(w, h) * 0.75)
      g2.addColorStop(0, 'rgba(141, 139, 167, 0.06)')
      g2.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, w, h)

      // Intro progress: particle appears, then draws, then fades
      const drawT = clamp01((now - startRef.current) / drawMs)
      const progress = easeOutExpo(drawT)

      const fadeT = clamp01((now - startRef.current - (totalMs - fadeMs)) / fadeMs)
      const alpha = phase === 'fade' ? 1 - easeOutExpo(fadeT) : 1

      // Compute current point along polyline.
      const segCount = path.length - 1
      const segFloat = progress * segCount
      const seg = Math.min(segCount - 1, Math.floor(segFloat))
      const segT = segFloat - seg

      const [x0n, y0n] = path[seg]
      const [x1n, y1n] = path[seg + 1]
      const x = lerp(x0n, x1n, segT) * w
      const y = lerp(y0n, y1n, segT) * h

      // Draw trail up to current segment with soft glow.
      ctx.save()
      ctx.globalAlpha = 0.92 * alpha
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      const stroke = 'rgba(255, 122, 89, 0.78)'
      const strokeCool = 'rgba(110, 168, 254, 0.42)'

      const drawTrail = (width: number, blur: number, a: number, color: string) => {
        ctx.globalAlpha = a * alpha
        ctx.strokeStyle = color
        ctx.lineWidth = width
        ctx.shadowColor = color
        ctx.shadowBlur = blur
        ctx.beginPath()
        for (let i = 0; i <= seg; i++) {
          const [pxn, pyn] = path[i]
          const px = pxn * w
          const py = pyn * h
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        // partial segment
        ctx.lineTo(x, y)
        ctx.stroke()
      }

      drawTrail(10, 24, 0.10, strokeCool)
      drawTrail(6, 22, 0.18, strokeCool)
      drawTrail(4, 18, 0.32, stroke)
      drawTrail(2.25, 12, 0.72, 'rgba(255, 122, 89, 0.95)')

      // Particle head with bloom.
      ctx.shadowColor = 'rgba(255, 122, 89, 0.95)'
      ctx.shadowBlur = 28
      ctx.fillStyle = 'rgba(255, 122, 89, 0.95)'
      ctx.beginPath()
      ctx.arc(x, y, 3.2, 0, Math.PI * 2)
      ctx.fill()

      ctx.shadowColor = 'rgba(255, 255, 255, 0.9)'
      ctx.shadowBlur = 18
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
      ctx.beginPath()
      ctx.arc(x, y, 1.6, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()

      // Subtle vignette (cinematic framing)
      ctx.save()
      ctx.globalAlpha = 0.55 * alpha
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.5, Math.min(w, h) * 0.15, w * 0.5, h * 0.5, Math.max(w, h) * 0.7)
      vg.addColorStop(0, 'rgba(0,0,0,0)')
      vg.addColorStop(1, 'rgba(0,0,0,0.16)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, w, h)
      ctx.restore()

      if (t >= 1) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        rafRef.current = null
        onDone?.()
        return
      }

      if (tRaw >= (totalMs - fadeMs) / totalMs && phase !== 'fade') setPhase('fade')
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [onDone, path, phase])

  return (
    <div
      className="fixed inset-0 z-[100] pointer-events-none"
      aria-hidden="true"
      style={{
        background: 'rgba(247, 247, 242, 0.82)',
        backdropFilter: 'blur(10px) saturate(1.05)',
        WebkitBackdropFilter: 'blur(10px) saturate(1.05)',
      }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(800px 520px at 70% 38%, rgba(255,122,89,0.10) 0%, transparent 60%), radial-gradient(680px 520px at 26% 72%, rgba(110,168,254,0.08) 0%, transparent 65%)',
          opacity: 0.9,
        }}
      />
      <div className="absolute inset-0 intro-grain" />
    </div>
  )
}

