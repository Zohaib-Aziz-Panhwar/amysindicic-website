import { Reveal } from '../components/Common.jsx'
import BookButton from '../components/BookButton.jsx'
import { socials } from '../data/content.js'
import { asset } from '../lib/asset.js'
import { useTitle } from '../lib/useTitle.js'

/* Built from the client's Executive Coaching comp. The photographs were cut
   from that comp (public/images/coaching/), so swap in full-resolution
   originals there if the client supplies them. */

const UPWORK =
  socials.find((s) => s.key === 'upwork')?.href ||
  'https://www.upwork.com/freelancers/amysindicic'

const SERVICES = [
  { title: 'Executive Leadership', img: 'leadership' },
  { title: 'Career Advancement & Transitions', img: 'career' },
  { title: 'Retirement & Next Chapter', img: 'retirement' },
  { title: 'Government & Public Service', img: 'government' },
  { title: 'Military Leadership', img: 'military' },
  { title: 'Personal Reinvention & Resilience', img: 'reinvention' },
]

const STEPS = ['Clarity', 'Strategy', 'Action', 'Results']

const img = (name, ext = 'jpg') => asset(`/images/coaching/${name}.${ext}`)

function Arrow({ className = 'ec-arrow' }) {
  return (
    <svg className={className} viewBox="0 0 24 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 7h21M16 1.5 22 7l-6 5.5" />
    </svg>
  )
}

function UpworkButton() {
  return (
    <a className="ec-btn ec-btn--ghost" href={UPWORK} target="_blank" rel="noreferrer">
      <span>Executive Coaching Packages &amp; Testimonials on Upwork <Arrow /></span>
    </a>
  )
}

function BookCall() {
  return (
    <BookButton
      className="ec-btn ec-btn--gold"
      label={<span>Book a Strategy Call <Arrow /></span>}
    />
  )
}

export default function ExecutiveCoaching() {
  useTitle('Executive Coaching')
  return (
    <div className="ec">
      {/* ---------------- Hero ---------------- */}
      <section className="ec-hero">
        <div className="ec-hero__photo" style={{ backgroundImage: `url(${img('hero')})` }} />
        <div className="wrap ec-hero__inner">
          <p className="ec-eyebrow">Executive Coaching</p>
          <h1 className="ec-hero__title">
            Define<br />Your Next<br /><span className="gold">Chapter</span>
          </h1>
          <p className="ec-hero__lede">
            Lead, Transition, and<br />Create a Fulfilling Future.
          </p>
          <div className="ec-hero__ctas">
            <BookCall />
            <UpworkButton />
          </div>
        </div>
      </section>

      {/* ---------------- Coaching services ---------------- */}
      <section className="ec-services">
        <div className="wrap">
          <Reveal as="h2" className="ec-title">Coaching Services</Reveal>
          <div className="ec-grid">
            {SERVICES.map((s, i) => (
              <Reveal key={s.img} className="ec-card" delay={i * 60}>
                <img className="ec-card__img" src={img(s.img)} alt="" loading="lazy" />
                <h3 className="ec-card__title">{s.title}</h3>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Approach ---------------- */}
      <section className="ec-approach">
        <div className="wrap">
          <Reveal as="h2" className="ec-title ec-title--light">My Coaching Approach</Reveal>
          <ol className="ec-steps">
            {STEPS.map((s, i) => (
              <li key={s}>
                <Reveal className="ec-step" delay={i * 80}>{i + 1}. {s}</Reveal>
                {i < STEPS.length - 1 && <Arrow className="ec-steps__arrow" />}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- Testimonials pointer ---------------- */}
      <section className="ec-proof">
        <div className="wrap ec-proof__inner">
          <img className="ec-proof__bf" src={img('butterfly', 'png')} alt="" aria-hidden="true" />
          <p className="ec-proof__text">See what clients say about working with Amy</p>
          <UpworkButton />
        </div>
      </section>

      {/* ---------------- Closing ---------------- */}
      <section className="ec-closing" style={{ '--ec-closing-bg': `url(${img('closing')})` }}>
        <div className="wrap ec-closing__inner">
          <img className="ec-closing__bf" src={asset('/images/bf-approach.png')} alt="" aria-hidden="true" />
          <div className="ec-closing__body">
            <h2>Ready to explore<br />what&rsquo;s next?</h2>
            <BookCall />
          </div>
        </div>
      </section>
    </div>
  )
}
