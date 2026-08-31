import { Link } from 'react-router-dom'
import { footer, site } from '../data/content.js'

function IconLinkedIn() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.4 0H3.6A3.6 3.6 0 000 3.6v16.8A3.6 3.6 0 003.6 24h16.8a3.6 3.6 0 003.6-3.6V3.6A3.6 3.6 0 0020.4 0zM7.4 20.4H3.9V9h3.5v11.4zM5.6 7.4a2 2 0 110-4.1 2 2 0 010 4.1zm14.8 13h-3.5v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9v5.7H9.4V9h3.3v1.6h.1a3.7 3.7 0 013.3-1.8c3.5 0 4.2 2.3 4.2 5.3v6.3z" />
    </svg>
  )
}

function IconMail() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 6 10-6" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <span>{footer.copyright}</span>

        <span className="footer__connect">
          <strong style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em' }}>
            {footer.connect}
          </strong>
          {/* TODO (client): supply the real LinkedIn URL and email address. */}
          <a
            href={site.linkedin || '/contact'}
            aria-label="LinkedIn"
            {...(site.linkedin ? { target: '_blank', rel: 'noreferrer' } : {})}
          >
            <IconLinkedIn />
          </a>
          <a href={site.email ? `mailto:${site.email}` : '/contact'} aria-label="Email">
            <IconMail />
          </a>
        </span>

        <span className="footer__legal">
          {footer.legal.map((l, i) => (
            <span key={l.to}>
              {i > 0 && <span style={{ opacity: .5, margin: '0 8px' }}>|</span>}
              <Link to={l.to}>{l.label}</Link>
            </span>
          ))}
        </span>
      </div>
    </footer>
  )
}
