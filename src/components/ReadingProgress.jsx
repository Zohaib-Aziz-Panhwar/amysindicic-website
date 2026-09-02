import { useEffect, useState } from 'react'

/** Thin gold bar across the top showing how far through the article you are. */
export default function ReadingProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let raf = 0
    const measure = () => {
      raf = 0
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      setPct(scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(measure) }
    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="progress" aria-hidden="true">
      <span className="progress__bar" style={{ transform: `scaleX(${pct / 100})` }} />
    </div>
  )
}
