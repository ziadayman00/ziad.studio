'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

type IntroOverlayVideoProps = {
  src?: string
  posterSrc?: string
  onDone?: () => void
  /** Fires once when the “expand to site” beat starts (home shell can fade in underneath). */
  onExpandStart?: () => void
  endPaddingMs?: number
  absoluteMaxMs?: number
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

const letterH = 'min(56px, 8svh)'
/** Slightly after CSS mask transition (1.72s) so the curve can settle. */
const MASK_EXPAND_MS = 1880
/** After playback ends: hide the picture, hold on empty frame, then start the mask. */
const POST_VIDEO_HOLD_MS = 460

type Phase = 'play' | 'expanding'

export default function IntroOverlayVideo({
  src = '/video.mp4',
  posterSrc = '/light-logo.png',
  onDone,
  onExpandStart,
  endPaddingMs = 4000,
  absoluteMaxMs = 900_000,
}: IntroOverlayVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const maskWrapRef = useRef<HTMLDivElement | null>(null)
  const expandTimerRef = useRef<number | null>(null)
  const holdTimerRef = useRef<number | null>(null)

  const [phase, setPhase] = useState<Phase>('play')
  const [canPlay, setCanPlay] = useState(true)
  /** Video + in-frame UI hidden; empty screen before mask opens. */
  const [stageMediaHidden, setStageMediaHidden] = useState(false)

  const handoffRef = useRef(false)
  const handoffSequenceStartedRef = useRef(false)
  const failsafeIdRef = useRef<number | null>(null)
  const onDoneRef = useRef(onDone)
  const onExpandStartRef = useRef(onExpandStart)

  useEffect(() => {
    onDoneRef.current = onDone
    onExpandStartRef.current = onExpandStart
  }, [onDone, onExpandStart])

  const clearHoldTimer = () => {
    if (holdTimerRef.current != null) {
      window.clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
  }

  const clearFailsafe = () => {
    if (failsafeIdRef.current != null) {
      window.clearTimeout(failsafeIdRef.current)
      failsafeIdRef.current = null
    }
  }

  const completeHandoff = useCallback(() => {
    if (handoffRef.current) return
    handoffRef.current = true
    if (expandTimerRef.current != null) {
      window.clearTimeout(expandTimerRef.current)
      expandTimerRef.current = null
    }
    clearHoldTimer()
    onDoneRef.current?.()
  }, [])

  useLayoutEffect(() => {
    if (phase !== 'expanding') return

    const stage = stageRef.current
    const wrap = maskWrapRef.current
    if (!stage || !wrap) {
      completeHandoff()
      return
    }

    const r = stage.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight
    const s = Math.max(vw / Math.max(r.width, 1), vh / Math.max(r.height, 1)) * 1.018

    wrap.style.left = `${r.left + r.width / 2}px`
    wrap.style.top = `${r.top + r.height / 2}px`
    wrap.style.width = `${r.width}px`
    wrap.style.height = `${r.height}px`
    wrap.style.setProperty('--mask-scale', s.toFixed(5))

    // Hole sits above the stage in z-order; a transparent hole would otherwise show this
    // solid frame until the hole outgrows it — hide the frame as soon as the mask is armed.
    stage.style.transition = 'none'
    stage.style.opacity = '0'
    stage.style.visibility = 'hidden'
    stage.style.pointerEvents = 'none'

    wrap.classList.remove('intro-clip-mask-is-opening')
    // Force reflow so removing/re-adding the class always retriggers transition
    void wrap.offsetWidth

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        wrap.classList.add('intro-clip-mask-is-opening')
      })
    })

    expandTimerRef.current = window.setTimeout(() => {
      expandTimerRef.current = null
      completeHandoff()
    }, MASK_EXPAND_MS)

    return () => {
      if (expandTimerRef.current != null) {
        window.clearTimeout(expandTimerRef.current)
        expandTimerRef.current = null
      }
      wrap.classList.remove('intro-clip-mask-is-opening')
      stage.style.removeProperty('transition')
      stage.style.removeProperty('opacity')
      stage.style.removeProperty('visibility')
      stage.style.removeProperty('pointer-events')
    }
  }, [phase, completeHandoff])

  useEffect(() => {
    if (prefersReducedMotion()) {
      onExpandStartRef.current?.()
      if (!handoffRef.current) {
        handoffRef.current = true
        clearFailsafe()
        onDoneRef.current?.()
      }
      return
    }

    const v = videoRef.current
    if (!v) return

    const startMaskExpand = () => {
      if (handoffRef.current) return
      onExpandStartRef.current?.()
      setPhase('expanding')
    }

    /** End of playback / failsafe: clear the picture first, then open the mask. */
    const startHandoffSequence = () => {
      if (handoffRef.current || handoffSequenceStartedRef.current) return
      handoffSequenceStartedRef.current = true
      clearFailsafe()

      try {
        v.pause()
      } catch {
        // ignore
      }
      setStageMediaHidden(true)

      holdTimerRef.current = window.setTimeout(() => {
        holdTimerRef.current = null
        if (handoffRef.current) return
        startMaskExpand()
      }, POST_VIDEO_HOLD_MS)
    }

    const quickExit = () => {
      if (handoffRef.current) return
      handoffRef.current = true
      clearFailsafe()
      clearHoldTimer()
      onDoneRef.current?.()
    }

    const scheduleFailsafeFromDuration = () => {
      const d = v.duration
      if (!Number.isFinite(d) || d <= 0) return
      clearFailsafe()
      const ms = Math.min(absoluteMaxMs, d * 1000 + endPaddingMs)
      failsafeIdRef.current = window.setTimeout(() => startHandoffSequence(), ms)
    }

    const onEnded = () => startHandoffSequence()
    const onError = () => {
      setCanPlay(false)
      quickExit()
    }

    const onMeta = () => scheduleFailsafeFromDuration()

    v.addEventListener('ended', onEnded)
    v.addEventListener('error', onError)
    v.addEventListener('loadedmetadata', onMeta)
    v.addEventListener('durationchange', onMeta)

    failsafeIdRef.current = window.setTimeout(() => startHandoffSequence(), absoluteMaxMs)

    if (v.readyState >= 1) {
      scheduleFailsafeFromDuration()
    }

    v.play().catch(() => {
      setCanPlay(false)
      quickExit()
    })

    return () => {
      v.removeEventListener('ended', onEnded)
      v.removeEventListener('error', onError)
      v.removeEventListener('loadedmetadata', onMeta)
      v.removeEventListener('durationchange', onMeta)
      clearFailsafe()
      clearHoldTimer()
    }
  }, [absoluteMaxMs, endPaddingMs])

  const chromeHidden = phase === 'expanding'
  const mediaEase = 'opacity 0.36s cubic-bezier(0.16, 1, 0.32, 1)'

  return (
    <div className="fixed inset-0 z-[100] overflow-visible pointer-events-none" aria-hidden="true">
      {/* Decorative chrome — fades as the mask opens */}
      <div
        className={`intro-chrome-fade absolute inset-0 z-[10] ${chromeHidden ? 'is-hidden' : ''}`}
        style={{ transition: 'opacity 0.95s cubic-bezier(0.16, 1, 0.32, 1)' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 120% 100% at 50% 20%, #15151a 0%, #070708 55%, #020203 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(900px 620px at 72% 32%, rgba(255,122,89,0.14) 0%, transparent 58%), radial-gradient(780px 540px at 22% 78%, rgba(110,168,254,0.10) 0%, transparent 62%)',
            opacity: 0.85,
          }}
        />
        <div className="absolute inset-0 intro-grain opacity-[0.42]" style={{ mixBlendMode: 'overlay' }} />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.55) 100%)',
            opacity: 0.9,
          }}
        />

        <div
          className="absolute left-0 right-0 top-0 z-20 bg-black"
          style={{ height: letterH, boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.06)' }}
        />
        <div
          className="absolute left-0 right-0 bottom-0 z-20 bg-black"
          style={{ height: letterH, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)' }}
        />

        <div
          className="absolute left-0 right-0 z-30 flex justify-center px-6"
          style={{ top: `calc(${letterH} + 10px)` }}
        >
          <div
            className="flex items-center gap-3 rounded-full border border-white/10 bg-black/55 px-5 py-2 backdrop-blur-md"
            style={{
              boxShadow: '0 12px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--coral)]" style={{ boxShadow: '0 0 12px rgba(255,122,89,0.7)' }} />
            <span className="font-sans text-[10px] font-medium tracking-[0.28em] text-white/90 uppercase">Opening scene</span>
            <span className="hidden font-mono text-[10px] text-white/35 sm:inline">01</span>
          </div>
        </div>
      </div>

      {/* Video stage (no scale on handoff — the clip mask does the reveal) */}
      <div
        className="absolute inset-0 z-[40] flex items-center justify-center px-4"
        style={{ paddingTop: letterH, paddingBottom: letterH }}
      >
        <div className="intro-stage-settle relative" style={{ width: 'min(820px, 88vw)', perspective: '1400px' }}>
          <div
            ref={stageRef}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl"
            style={{
              aspectRatio: '16 / 9',
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.08), 0 32px 120px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.04)',
              background: '#050506',
            }}
          >
            <div
              className="pointer-events-none absolute inset-0 z-[1]"
              style={{
                background:
                  'radial-gradient(640px 420px at 55% 35%, rgba(255,122,89,0.12) 0%, transparent 55%), radial-gradient(520px 380px at 30% 75%, rgba(110,168,254,0.08) 0%, transparent 60%)',
                opacity: stageMediaHidden ? 0 : 0.9,
                transition: mediaEase,
              }}
            />

            {canPlay ? (
              <video
                ref={videoRef}
                className="absolute inset-0 z-0 h-full w-full object-cover"
                style={{
                  opacity: stageMediaHidden ? 0 : 1,
                  transition: mediaEase,
                }}
                src={src}
                poster={posterSrc}
                muted
                playsInline
                preload="auto"
              />
            ) : (
              <img
                src={posterSrc}
                alt=""
                className="absolute inset-0 z-0 h-full w-full object-cover"
                style={{
                  opacity: stageMediaHidden ? 0 : 0.95,
                  transition: mediaEase,
                }}
              />
            )}

            <div
              className="pointer-events-none absolute inset-0 z-[2]"
              style={{
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 22%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.12) 62%, rgba(0,0,0,0.82) 100%)',
                opacity: stageMediaHidden ? 0 : 1,
                transition: mediaEase,
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 z-[2]"
              style={{
                background: 'radial-gradient(ellipse 75% 65% at 50% 50%, transparent 25%, rgba(0,0,0,0.38) 100%)',
                opacity: stageMediaHidden ? 0 : 1,
                transition: mediaEase,
              }}
            />

            <div
              className="intro-film-sheen pointer-events-none absolute inset-0 z-[2] mix-blend-overlay"
              style={{
                background: 'linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.07) 50%, transparent 60%)',
                backgroundSize: '200% 200%',
                opacity: stageMediaHidden ? 0 : 0.3,
                transition: mediaEase,
              }}
            />

            <div
              className="absolute bottom-0 left-0 right-0 z-[3] flex items-end justify-between gap-4 p-5 sm:p-7"
              style={{
                opacity: stageMediaHidden ? 0 : 1,
                transition: mediaEase,
              }}
            >
              <div className="flex min-w-0 flex-col gap-2">
                <img src="/light-logo.png" alt="" aria-hidden className="h-9 w-auto object-left object-contain sm:h-11" />
                <p className="max-w-[min(340px,52vw)] font-sans text-[11px] leading-relaxed tracking-wide text-white/88 sm:text-xs">
                  <span className="text-[var(--coral)]">Cinematic systems</span>
                  <span className="text-white/40"> · </span>
                  interface direction &amp; performance-first builds
                </p>
              </div>
              <div className="hidden shrink-0 flex-col items-end text-right sm:flex">
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/35">SIGNAL</span>
                <span className="mt-1 font-display text-lg font-bold tracking-tight text-white/90">LIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rectangular “clipping mask”: transparent hole + solid frame — scales up to reveal home */}
      {phase === 'expanding' ? (
        <div className="pointer-events-none fixed inset-0 z-[95]" aria-hidden>
          <div
            ref={maskWrapRef}
            className="intro-clip-mask-wrap absolute"
          >
            <div className="intro-clip-mask-punch size-full" />
          </div>
        </div>
      ) : null}
    </div>
  )
}
