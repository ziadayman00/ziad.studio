'use client'

import { useLayoutEffect, useMemo, useState } from 'react'
import IntroOverlayVideo from '@/components/experience/IntroOverlayVideo'

type IntroGateProps = {
  children: React.ReactNode
  storageKey?: string
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

export default function IntroGate({ children, storageKey = 'ziad:intro:seen' }: IntroGateProps) {
  const [show, setShow] = useState(false)
  const [ready, setReady] = useState(false)
  /** Home shell fades in under the expanding “screen” while the intro still covers it. */
  const [liftUnderlay, setLiftUnderlay] = useState(false)

  const canRun = useMemo(() => {
    if (typeof window === 'undefined') return false
    if (prefersReducedMotion()) return false
    return true
  }, [])

  useLayoutEffect(() => {
    if (!canRun) {
      document.documentElement.removeAttribute('data-home-reveal')
      setReady(true)
      return
    }

    try {
      const seen = window.sessionStorage.getItem(storageKey)
      if (seen === '1') {
        document.documentElement.removeAttribute('data-home-reveal')
        setReady(true)
        return
      }
      document.documentElement.removeAttribute('data-home-reveal')
      document.documentElement.setAttribute('data-intro', 'true')
      setShow(true)
      setReady(true)
    } catch {
      document.documentElement.removeAttribute('data-home-reveal')
      document.documentElement.setAttribute('data-intro', 'true')
      setShow(true)
      setReady(true)
    }
  }, [canRun, storageKey])

  const finishIntro = () => {
    document.documentElement.removeAttribute('data-intro')
    try {
      window.sessionStorage.setItem(storageKey, '1')
    } catch {
      // ignore
    }
    // Reveal choreography without a second React commit (avoids flash / extra paint after intro).
    document.documentElement.setAttribute('data-home-reveal', '1')
    setShow(false)
  }

  if (!ready) return null

  const shellOpacity = !show ? 1 : liftUnderlay ? 1 : 0

  return (
    <>
      {show && <IntroOverlayVideo onExpandStart={() => setLiftUnderlay(true)} onDone={finishIntro} />}
      <div
        className="app-shell"
        style={{
          opacity: shellOpacity,
          transition: liftUnderlay
            ? 'opacity 1.42s cubic-bezier(0.16, 1, 0.28, 1) 0.06s'
            : 'opacity 1.15s var(--ease-out-expo) 0.14s',
        }}
      >
        {children}
      </div>
    </>
  )
}
