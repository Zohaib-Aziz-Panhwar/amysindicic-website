import { useEffect, useState } from 'react'
import { usePrefersReducedMotion, useInView } from '../lib/motion.js'

// Splits "30+" into prefix "", number 30, suffix "+".
const PARTS = /^(\D*?)([\d][\d,]*)(.*)$/

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

/**
 * Counts up to a figure the first time it scrolls into view.
 * Falls back to the final value immediately for reduced-motion users, and
 * renders the value verbatim if it isn't numeric.
 */
export default function CountUp({ value, duration = 1500, className = '' }) {
  const reduced = usePrefersReducedMotion()
  const [ref, inView] = useInView({ threshold: 0.4 })
  const match = PARTS.exec(String(value))
  const target = match ? Number(match[2].replace(/,/g, '')) : null
  // Start at zero when we intend to animate, so the final figure never
  // flashes on mount and then reset to 0 as it scrolls into view.
  const [n, setN] = useState(() => (reduced ? (target ?? 0) : 0))

  useEffect(() => {
    if (target === null) return
    if (reduced) { setN(target); return }
    if (!inView) return
    let raf
    const t0 = performance.now()
    const frame = (now) => {
      const p = Math.min(1, (now - t0) / duration)
      setN(Math.round(easeOutCubic(p) * target))
      if (p < 1) raf = requestAnimationFrame(frame)
    }
    setN(0)
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [inView, reduced, target, duration])

  if (target === null) return <span className={className}>{value}</span>

  return (
    <span ref={ref} className={className} aria-label={String(value)}>
      <span aria-hidden="true">
        {match[1]}{n.toLocaleString()}{match[3]}
      </span>
    </span>
  )
}
