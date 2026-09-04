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
            <img src={about.portrait} alt={about.name} width="720" height="900" />
          </Reveal>
          {/* The whole biography sits beside the portrait rather than
              running on beneath it, which halves the page's height. */}
          <div className="about-copy">
            <Reveal delay={110}>
              <h2 className="about-name">{about.name}</h2>
              <hr className="about-rule" />
              <p className="about-lede">{about.lede}</p>
            </Reveal>

            <div className="about-body">
              {about.body.map((para, i) => (
                <Reveal key={i} as="p" delay={i * 60}>{para}</Reveal>
              ))}
            </div>

            <Reveal delay={80}>
              <BookButton label={ctas.about} />
            </Reveal>
          </div>
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
