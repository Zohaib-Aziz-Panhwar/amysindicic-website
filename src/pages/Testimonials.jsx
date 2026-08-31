import { PageHero, ClosingBand, Reveal } from '../components/Common.jsx'
import { testimonials } from '../data/content.js'

function Stars({ count }) {
  if (!count) return null
  return (
    <div className="stars" aria-label={`${count} out of 5`}>
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.1 6.1 20.2l1.2-6.6L2.5 9l6.6-.9z" />
        </svg>
      ))}
    </div>
  )
}

/**
 * Two initials from a name, ignoring post-nominals and middle initials:
 * "Sandi L. Coleman, MD, MS" -> "SC"
 */
function initialsOf(name) {
  return name
    .split(',')[0]
    .split(/\s+/)
    .filter((w) => w.replace(/\W/g, '').length > 1)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

/** Reviewer portrait when supplied, otherwise a monogram. */
function Avatar({ name, photo }) {
  if (photo) {
    return <img className="testi__avatar" src={photo} alt={name} width="52" height="52" />
  }
  return (
    <span className="testi__avatar testi__avatar--initials" aria-hidden="true">
      {initialsOf(name)}
    </span>
  )
}

export default function Testimonials() {
  return (
    <>
      <PageHero
        title="Testimonials"
        text="What clients say about working with Amy."
      />

      <section className="section testimonials">
        <div className="wrap testi-grid">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} className="testi" delay={(i % 2) * 90}>
              <span className="testi__mark" aria-hidden="true">&ldquo;</span>
              <Stars count={t.rating} />
              {t.quote.map((para, j) => (
                <p key={j}>{para}</p>
              ))}
              <footer className="testi__by">
                <Avatar name={t.name} photo={t.photo} />
                <span className="testi__meta">
                  <cite className="testi__name">{t.name}</cite>
                  {t.role && <span className="testi__role">{t.role}</span>}
                  <span className="testi__date">{t.date}</span>
                </span>
              </footer>
            </Reveal>
          ))}
        </div>
      </section>

      <ClosingBand />
    </>
  )
}
