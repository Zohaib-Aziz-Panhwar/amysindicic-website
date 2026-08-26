import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { VIDEO_ID } from '../data'

export const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
export const Play = () => <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>

export function Reveal({ children, className = '', as = 'div', delay = 0, ...rest }) {
  const reduce = useReducedMotion()
  const M = motion[as] || motion.div
  return (
    <M className={className} initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay }} onViewportEnter={(e) => e?.target?.classList.add('in')} {...rest}>
      {children}
    </M>
  )
}

export function SectionHead({ eyebrow, title, children, center }) {
  return (
    <Reveal className={'section-head' + (center ? ' section-head--center' : '')}>
      <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2></div>
      {children}
    </Reveal>
  )
}

export function PageHero({ crumb, eyebrow, title, lede }) {
  return (
    <section className="page-hero dark"><div className="wrap">
      <div className="crumbs"><Link to="/">Home</Link> / {crumb}</div>
      <span className="eyebrow">{eyebrow}</span>
      <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>{title}</motion.h1>
      <motion.p className="lede" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .2, duration: .7 }}>{lede}</motion.p>
    </div></section>
  )
}

/* video modal */
const VideoCtx = createContext(() => {})
export const useVideo = () => useContext(VideoCtx)
export function VideoProvider({ children }) {
  const [id, setId] = useState(null)
  useEffect(() => { const k = (e) => e.key === 'Escape' && setId(null); addEventListener('keydown', k); document.body.style.overflow = id ? 'hidden' : ''; return () => removeEventListener('keydown', k) }, [id])
  return (
    <VideoCtx.Provider value={(v = VIDEO_ID) => setId(v)}>
      {children}
      <div className={'modal' + (id ? ' open' : '')} role="dialog" aria-modal="true" aria-label="Video" onClick={(e) => e.target === e.currentTarget && setId(null)}>
        <button className="modal__close" aria-label="Close" onClick={() => setId(null)}>×</button>
        <div className="modal__box">{id && <iframe src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`} title="Amy Sindicic video" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />}</div>
      </div>
    </VideoCtx.Provider>
  )
}

export function CountUp({ to, suffix = '' }) {
  const ref = useRef(null); const [v, setV] = useState(to); const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce || !ref.current) return
    const o = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; o.disconnect(); let t0; const step = (t) => { t0 ??= t; const p = 1 - Math.pow(1 - Math.min((t - t0) / 1200, 1), 3); setV(Math.round(to * p)); if (p < 1) requestAnimationFrame(step) }; requestAnimationFrame(step) }, { threshold: .6 })
    o.observe(ref.current); return () => o.disconnect()
  }, [to, reduce])
  return <span ref={ref}>{v}{suffix}</span>
}
