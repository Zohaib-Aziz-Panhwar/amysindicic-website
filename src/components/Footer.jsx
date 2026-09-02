import { Link } from 'react-router-dom'
import { footer, site, nav, services, servicesCta, ctas } from '../data/content.js'
import { asset } from '../lib/asset.js'

function IconLinkedIn() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.4 0H3.6A3.6 3.6 0 000 3.6v16.8A3.6 3.6 0 003.6 24h16.8a3.6 3.6 0 003.6-3.6V3.6A3.6 3.6 0 0020.4 0zM7.4 20.4H3.9V9h3.5v11.4zM5.6 7.4a2 2 0 110-4.1 2 2 0 010 4.1zm14.8 13h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.3v1.6h.1a3.7 3.7 0 013.3-1.8c3.5 0 4.2 2.3 4.2 5.3v6.3z" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 6 10-6" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
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
          <a className="footer__ext" href={servicesCta.href} target="_blank" rel="noreferrer">
            transformations123.com <span aria-hidden="true">&rarr;</span>
          </a>
        </div>

        <div className="footer__col footer__connect">
          <h4>{footer.connect}</h4>
          <a
            className="footer__social"
            href={site.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            <IconLinkedIn /> LinkedIn
          </a>
          {/* Shown only once a real address is supplied. */}
          {site.email && (
            <a className="footer__social" href={`mailto:${site.email}`}>
              <IconMail /> {site.email}
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
