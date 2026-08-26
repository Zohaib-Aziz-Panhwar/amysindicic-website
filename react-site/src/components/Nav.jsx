import { NavLink, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
const LINKS = [['/services', 'Services'], ['/about', 'About'], ['/case-studies', 'Case Studies'], ['/resources', 'Free Resources'], ['/blog', 'Blog']]
export default function Nav() {
  const [open, setOpen] = useState(false)
  const { scrollYProgress } = useScroll(); const w = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  return (<>
    <motion.div className="progress-bar" style={{ scaleX: w, width: '100%', transformOrigin: '0 0' }} aria-hidden="true" />
    <header className="nav"><div className="wrap">
      <Link className="brand" to="/"><img src="assets/brand/butterfly-badge.png" alt="" /><span><b>Amy Sindicic</b><small>Transformations 123</small></span></Link>
      <ul className={'nav__links' + (open ? ' open' : '')} id="navLinks" onClick={() => setOpen(false)}>
        {LINKS.map(([to, l]) => <li key={to}><NavLink to={to}>{l}</NavLink></li>)}
        <li><Link to="/contact" className="btn btn--primary">Book a discovery call</Link></li>
      </ul>
      <button className="nav__toggle" aria-label="Open menu" aria-expanded={open} aria-controls="navLinks" onClick={() => setOpen(!open)}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
      </button>
    </div></header>
  </>)
}
