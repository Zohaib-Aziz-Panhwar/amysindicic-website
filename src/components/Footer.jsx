import { Link } from 'react-router-dom'
import { footer, site, nav, services, servicesCta, ctas, socials } from '../data/content.js'
import { asset } from '../lib/asset.js'
import { SocialMark, Mail, InstagramGradientDefs } from './SocialIcons.jsx'

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
          <a className="footer__ext" href={servicesCta.href} target="_blank" rel="noreferrer">
            transformations123.com <span aria-hidden="true">&rarr;</span>
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
