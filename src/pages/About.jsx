import { PageHero, ClosingBand, Reveal } from '../components/Common.jsx'
import { about, ctas } from '../data/content.js'
import BookButton from '../components/BookButton.jsx'
import { asset } from '../lib/asset.js'
import { useTitle } from '../lib/useTitle.js'

export default function About() {
  useTitle('About Amy')
  return (
    <>
      <PageHero title="About Amy" text={about.credentials} />

      {/* Portrait alongside the opening statement. */}
      <section className="section">
        <div className="wrap about-lead">
          <Reveal className="about-portrait">
            <img src={asset('/images/amy-portrait.jpg')} alt={about.name} width="720" height="900" />
          </Reveal>
          <Reveal delay={110}>
            <h2 className="about-name">{about.name}</h2>
            <hr className="about-rule" />
            <p className="about-lede">{about.lede}</p>
            <BookButton label={ctas.about} />
          </Reveal>
        </div>

        {/* Part of the same section as the portrait: as two sections their
            padding stacked, and with the stat strip gone that was a void. */}
        <div className="wrap about-body">
          {about.body.map((para, i) => (
            <Reveal key={i} as="p" delay={i * 60}>{para}</Reveal>
          ))}
        </div>
      </section>

      {/* Philosophy pull-quote. */}
      <section className="section philosophy">
        <img className="bf-philosophy" src={asset('/images/bf-audience.png')} alt="" aria-hidden="true" />
        <div className="wrap philosophy__inner">
          <p className="philosophy__lead">{about.philosophyLead}</p>
          <blockquote className="philosophy__quote">{about.philosophy}</blockquote>
          <p className="philosophy__closing">{about.closing}</p>
        </div>
      </section>

      <ClosingBand />
    </>
  )
}
