'use client'

import { useEffect, useRef } from 'react'

interface ScrollRevealOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

/**
 * Custom hook for scroll-triggered reveal animations.
 * Adds 'reveal-visible' class to child elements with 'reveal' (or 'reveal-left', 'reveal-right', 'reveal-scale') classes
 * when they enter the viewport.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {}
) {
  const ref = useRef<T>(null)
  const { threshold = 0.15, rootMargin = '0px 0px -60px 0px', once = true } = options

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const elements = container.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale, .text-reveal'
    )

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('reveal-visible')
          }
        })
      },
      { threshold, rootMargin }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [threshold, rootMargin, once])

  return ref
}

/**
 * Hook for parallax scrolling effect.
 * Moves the element based on scroll position.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(speed: number = 0.3) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let ticking = false

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect()
          const viewportCenter = window.innerHeight / 2
          const elementCenter = rect.top + rect.height / 2
          const offset = (elementCenter - viewportCenter) * speed
          el.style.transform = `translateY(${offset}px)`
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return ref
}

/**
 * Parallax that only runs while in-view.
 * Keeps scroll listeners off for most of the page (perf-friendly).
 */
export function useParallaxInView<T extends HTMLElement = HTMLDivElement>(
  speed: number = 0.3,
  options: { rootMargin?: string; threshold?: number } = {}
) {
  const ref = useRef<T>(null)
  const { rootMargin = '0px 0px -20% 0px', threshold = 0.05 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let active = false
    let ticking = false

    const onScroll = () => {
      if (!active) return
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect()
          const viewportCenter = window.innerHeight / 2
          const elementCenter = rect.top + rect.height / 2
          const offset = (elementCenter - viewportCenter) * speed
          el.style.transform = `translateY(${offset}px)`
          ticking = false
        })
        ticking = true
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (!entry) return
        active = entry.isIntersecting
        if (active) onScroll()
      },
      { rootMargin, threshold }
    )

    io.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [rootMargin, speed, threshold])

  return ref
}
