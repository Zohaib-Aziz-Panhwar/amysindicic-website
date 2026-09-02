import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { nav, site, ctas } from '../data/content.js'
import BookButton from './BookButton.jsx'
import { asset } from '../lib/asset.js'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // The home hero is dark enough to carry a transparent header until scroll.
  const overHero = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const solid = scrolled || !overHero || menuOpen

  return (
    <header
      className={[
        'header',
        solid ? 'header--solid' : 'header--transparent',
        scrolled ? 'header--compact' : '',
      ].join(' ').trim()}
    >
      <div className="wrap header__inner">
        <Link to="/" className="brand" aria-label={`${site.name} — home`}>
          <img src={asset('/images/logo.png')} alt={site.name} />
          <span className="brand__tag">{site.tagline}</span>
        </Link>

        <nav className={`nav ${menuOpen ? 'nav--open' : ''}`} aria-label="Main">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
          <BookButton label={ctas.nav} />
        </nav>

        <button
          className={`burger ${menuOpen ? 'burger--open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {/* The open/closed shape is handled in CSS, where the bar spacing
              is known — inline transforms drifted out of alignment. */}
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  )
}
