import { Link } from 'react-router-dom'
import { footer, site, nav, services, servicesCta, ctas, socials } from '../data/content.js'
import { asset } from '../lib/asset.js'
import { SocialMark, Mail, InstagramGradientDefs } from './SocialIcons.jsx'

function Globe() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4.5" ry="10" />
      <path d="M2 12h20M4 6.5h16M4 17.5h16" />
    </svg>
  )
}

function Arrow() {
  return (
    <svg width="26" height="12" viewBox="0 0 34 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M0 7h30M25 2l5 5-5 5" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
      <InstagramGradientDefs />
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <img src={asset('/images/logo.png')} alt={site.name} />
          <p>{footer.blurb}</p>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h4>Explore</h4>
          <ul>
            {nav.map((item) => (
              <li key={item.to}><Link to={item.to}>{item.label}</Link></li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h4>Services</h4>
          <ul>
            {services.map((s) => <li key={s.slug}>{s.title}</li>)}
          </ul>
          <a
            className="footer__cta-bar"
            href={servicesCta.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Globe />
            <span className="footer__cta-text">
              <strong>{servicesCta.line1}</strong>
              <span>{servicesCta.line2}</span>
            </span>
            <Arrow />
          </a>
        </div>

        <div className="footer__col footer__connect">
          <h4>{footer.connect}</h4>
          <div className="footer__socials">
            {socials.map((s) => (
              <a
                key={s.key}
                className="footer__social"
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                title={s.label}
                style={s.brand ? { color: s.brand } : undefined}
              >
                <SocialMark name={s.key} />
              </a>
            ))}
          </div>

          {site.email && (
            <a className="footer__mail" href={`mailto:${site.email}`}>
              <Mail /> {site.email}
            </a>
          )}
          <a
            className="btn footer__btn"
            href={site.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {ctas.footer}
          </a>
        </div>
      </div>

      <div className="wrap footer__bar">
        <span>&copy; {new Date().getFullYear()} {footer.copyright}</span>
        <span className="footer__legal">
          {footer.legal.map((l, i) => (
            <span key={l.to}>
              {i > 0 && <span className="footer__sep" aria-hidden="true">|</span>}
              <Link to={l.to}>{l.label}</Link>
            </span>
          ))}
        </span>
      </div>
    </footer>
  )
}
