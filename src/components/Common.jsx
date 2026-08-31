import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { closing } from '../data/content.js'
import BookButton from './BookButton.jsx'
import { asset } from '../lib/asset.js'

/** Scrolls to the top on every route change. */
export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

/** Fades content in as it enters the viewport. */
export function Reveal({ children, as: Tag = 'div', className = '', delay = 0, ...rest }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.unobserve(el) }
    }, { threshold: 0.1, rootMargin: '0px 0px -50px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/**
 * Marks copy the approved design does not supply. Deliberately conspicuous so
 * it cannot ship unnoticed — delete each one as the client provides real text.
 */
export function Placeholder({ label = 'Copy to be supplied by client', children }) {
  return (
    <div className="placeholder">
      <span className="placeholder__tag">{label}</span>
      {children}
    </div>
  )
}

/** Inner-page hero band. */
export function PageHero({ title, text }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </section>
  )
}

/** Closing call-to-action band, repeated at the foot of every page. */
export function ClosingBand() {
  return (
    <section className="closing">
      <div className="wrap closing__grid">
        <img className="bf-closing" src={asset('/images/bf-closing.png')} alt="" aria-hidden="true" />
        <h2>
          {closing.titleLine1}
          <br />
          <span className="gold">{closing.titleLine2}</span>
        </h2>
        <p className="closing__text" style={{ margin: 0 }}>{closing.text}</p>
        <BookButton label={closing.cta} />
      </div>
    </section>
  )
}
