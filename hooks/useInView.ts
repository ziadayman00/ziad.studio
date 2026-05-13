'use client'

import { useEffect, useRef, useState } from 'react'

type Options = IntersectionObserverInit & {
  once?: boolean
}

export function useInView<T extends Element>(options: Options = {}) {
  const { once = true, root = null, rootMargin = '0px 0px -10% 0px', threshold = 0.1 } = options
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        if (entry.isIntersecting) {
          setInView(true)
          if (once) io.disconnect()
        } else if (!once) {
          setInView(false)
        }
      },
      { root, rootMargin, threshold }
    )

    io.observe(el)
    return () => io.disconnect()
  }, [once, root, rootMargin, threshold])

  return { ref, inView }
}

