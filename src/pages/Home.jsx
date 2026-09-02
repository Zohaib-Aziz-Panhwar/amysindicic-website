import { Link } from 'react-router-dom'
import { Reveal, ClosingBand } from '../components/Common.jsx'
import {
  hero, banner, servicesHeading, services, servicesCta,
  audiences, approachHeading, approach, blogHeading, posts, blogCta, ctas,
} from '../data/content.js'
import BookButton from '../components/BookButton.jsx'
import { asset } from '../lib/asset.js'
import Typewriter from '../components/Typewriter.jsx'

function Arrow() {
  return (
    <svg width="34" height="14" viewBox="0 0 34 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M0 7h30M25 2l5 5-5 5" />
    </svg>
  )
}

function Globe() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4.5" ry="10" />
      <path d="M2 12h20M4 6.5h16M4 17.5h16" />
    </svg>
  )
}

export default function Home() {
  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="hero">
        {/* Amy's photograph is kept from the previous approved design, per the
            client — it is deliberately NOT taken from the newer comp. */}
        <div className="hero__photo" style={{ backgroundImage: `url(${asset('/images/amy-hero.jpg')})` }} />
        <img className="hero__butterfly" src={asset('/images/bf-hero.png')} alt="" aria-hidden="true" />
        <div className="wrap">
          <div className="hero__inner">
            <p className="hero__eyebrow">{hero.eyebrow}</p>
            <h1>
              {hero.titleLine1}
              <br />
              <span className="gold">{hero.titleLine2}</span>
            </h1>
            <hr className="hero__rule" />
            <p><Typewriter text={hero.text} /></p>
            <BookButton label={ctas.hero} />
          </div>
        </div>
      </section>

      {/* ---------------- Positioning banner ---------------- */}
      <section className="banner">
        <img className="bf-banner" src={asset('/images/bf-banner.png')} alt="" aria-hidden="true" />
        <div className="wrap banner__grid">
          <Reveal>
            <h2>
              {banner.titleLine1}
              <br />
              {banner.titleLine2}
              <br />
              <span className="gold">{banner.titleLine3}</span>
            </h2>
          </Reveal>
          <Reveal className="banner__right" delay={100}>
            <p>{banner.text}</p>
            <Link to="/about" className="btn btn--outline">{banner.cta}</Link>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Services ---------------- */}
      <section className="section services">
        <div className="wrap">
          <Reveal as="h2" className="sec-title">{servicesHeading}</Reveal>
          <div className="svc-grid">
            {services.map((s, i) => (
              <Reveal key={s.slug} className="svc" delay={i * 70}>
                <h3>{s.title}</h3>
                <hr className="svc__rule" />
                <p>{s.blurb}</p>
              </Reveal>
            ))}
          </div>

          <a className="svc-cta" href={servicesCta.href} target="_blank" rel="noreferrer">
            <Globe />
            <span className="svc-cta__text">
              <strong>{servicesCta.line1}</strong>
              <span>{servicesCta.line2}</span>
            </span>
            <Arrow />
          </a>
        </div>
      </section>

      {/* ---------------- Audiences ---------------- */}
      <section className="section audiences">
        <img className="bf-audience" src={asset('/images/bf-audience.png')} alt="" aria-hidden="true" />
        <div className="wrap">
          <Reveal as="h2" className="sec-title">Who I Work With</Reveal>
          <div className="aud-grid">
            {audiences.map((a, i) => (
              <Reveal key={a.slug} className="aud" delay={i * 70}>
                <h3>{a.title}</h3>
                <p>{a.blurb}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- My approach ---------------- */}
      <section className="section approach">
        <img className="bf-approach" src={asset('/images/bf-approach.png')} alt="" aria-hidden="true" />
        <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
          <Reveal as="h2" className="sec-title">{approachHeading}</Reveal>
          <div className="appr-grid" style={{ margin: '0 auto' }}>
            {approach.map((a, i) => (
              <div key={a.n} style={{ display: 'contents' }}>
                <Reveal className="appr" delay={i * 80}>
                  <div className="appr__n">{a.n}</div>
                  <h3>{a.title}</h3>
                  <p>{a.text}</p>
                </Reveal>
                {i < approach.length - 1 && <div className="appr__arrow"><Arrow /></div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Blog ---------------- */}
      <section className="section blog">
        <div className="wrap">
          <Reveal as="h2" className="sec-title">{blogHeading}</Reveal>
          <div className="blog-grid">
            {posts.slice(0, 4).map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <Link to={`/blog/${p.slug}`} className="post">
                  <span className="post__frame">
                    <img src={p.image} alt="" loading="lazy" />
                  </span>
                  <span className="post__body">
                    <h3>{p.title}</h3>
                    <span className="post__more">Read more <span aria-hidden="true">&rarr;</span></span>
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div className="center" style={{ marginTop: 'clamp(18px, 2.4vw, 32px)' }}>
            <Link to="/blog" className="btn btn--dark">{blogCta}</Link>
          </div>
        </div>
      </section>

      <ClosingBand />
    </>
  )
}
