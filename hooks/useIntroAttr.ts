'use client'

import { useEffect, useState } from 'react'

/** Subscribe to `document.documentElement` attribute changes (e.g. `data-intro` from IntroGate). */
export function useHtmlAttrEquals(attr: string, value: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof document !== 'undefined' ? document.documentElement.getAttribute(attr) === value : false
  )

  useEffect(() => {
    const read = () => setMatches(document.documentElement.getAttribute(attr) === value)
    read()
    const mo = new MutationObserver(read)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: [attr] })
    return () => mo.disconnect()
  }, [attr, value])

  return matches
}
