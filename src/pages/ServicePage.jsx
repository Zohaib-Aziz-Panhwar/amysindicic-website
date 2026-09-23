import { Navigate, useParams, Link } from 'react-router-dom'
import { PageHero, ClosingBand, Reveal } from '../components/Common.jsx'
import BookButton from '../components/BookButton.jsx'
import { servicePages, ctas } from '../data/content.js'
import { useTitle } from '../lib/useTitle.js'

function Arrow() {
  return (
    <svg width="26" height="12" viewBox="0 0 34 14" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M0 7h30M25 2l5 5-5 5" />
    </svg>
  )
}

/** One offering, linking out to its Upwork product page. */
function OfferingCard({ item, label, delay }) {
  return (
    <Reveal
      as="a"
      className="offer"
      delay={delay}
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <h3>{item.title}</h3>
      <span className="offer__go">{label} <Arrow /></span>
    </Reveal>
  )
}

/** One price tier. The middle tier is marked as the usual choice. */
function TierCard({ tier, featured, delay }) {
  return (
    <Reveal className={`tier${featured ? ' tier--featured' : ''}`} delay={delay}>
      {featured && <span className="tier__flag">Most chosen</span>}
      <h3>{tier.name}</h3>
      <p className="tier__price">
        <span>{tier.price}</span>
        <span className="tier__dur">{tier.duration}</span>
      </p>
      <ul>
        {tier.items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </Reveal>
  )
}

export default function ServicePage() {
  const { slug } = useParams()
  const page = servicePages?.[slug]
  // Runs before the early return so the hook order stays stable.
  useTitle(page ? page.name.join(' ') : 'Services')
  if (!page) return <Navigate to="/" replace />

  const { name, tagline, kicker, eyebrow, heading, intro, offerings, tiers,
          linkLabel, linkHref, outcome } = page

  return (
    <>
      <PageHero title={name.join(' ')} text={tagline} />

      {kicker && (
        <p className="svcp-kicker">{kicker}</p>
      )}

      <section className="section svcp">
        <div className="wrap">
          {eyebrow && <Reveal as="p" className="svcp__eyebrow">{eyebrow}</Reveal>}
          {heading && <Reveal as="h2" className="sec-title">{heading}</Reveal>}
          {intro?.map((line, i) => (
            <Reveal as="p" key={i} className="svcp__intro" delay={i * 60}>{line}</Reveal>
          ))}

          {offerings && (
            <div className="offer-grid">
              {offerings.map((item, i) => (
                <OfferingCard key={item.title} item={item} label={linkLabel} delay={i * 70} />
              ))}
            </div>
          )}

          {tiers && (
            <>
              <div className="tier-grid">
                {tiers.map((t, i) => (
                  <TierCard key={t.name} tier={t} featured={i === 1} delay={i * 80} />
                ))}
              </div>
              {linkHref && (
                <div className="svcp__cta">
                  <a className="btn" href={linkHref} target="_blank" rel="noopener noreferrer">
                    {linkLabel}
                  </a>
                </div>
              )}
            </>
          )}

          {outcome && (
            <Reveal className="svcp__outcome">
              <h2>
                {outcome[0]}
                <br />
                <span className="gold">{outcome[1]}</span>
              </h2>
              <BookButton label={ctas.hero} />
            </Reveal>
          )}

          <p className="svcp__back">
            <Link to="/">&larr; Back to home</Link>
          </p>
        </div>
      </section>

      <ClosingBand />
    </>
  )
}
