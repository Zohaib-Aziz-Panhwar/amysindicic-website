import { useState } from 'react'
import { PageHero, ClosingBand, Reveal } from '../components/Common.jsx'
import BookButton from '../components/BookButton.jsx'
import { faqs, faqHeading, faqIntro, ctas, servicesCta } from '../data/content.js'
import { useTitle } from '../lib/useTitle.js'

function Chevron() {
  return (
    <svg
      className="faq__chevron"
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.4"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export default function Faqs() {
  useTitle('FAQs')
  // Only one answer open at a time; clicking the open question closes it.
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <>
      <PageHero title={faqHeading} text={faqIntro} />

      <section className="section faq-section">
        <div className="wrap faq-list">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <Reveal key={i} className={`faq ${isOpen ? 'faq--open' : ''}`} delay={(i % 3) * 50}>
                <h2 className="faq__q">
                  <button
                    type="button"
                    className="faq__trigger"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span className="faq__num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="faq__text">{item.q}</span>
                    <Chevron />
                  </button>
                </h2>

                {/* The wrapper animates from 0fr to 1fr, so the answer slides
                    open at its natural height without a hard-coded max. */}
                <div
                  className="faq__panel"
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  hidden={!isOpen}
                >
                  <div className="faq__panel-inner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}

          <div className="faq-footer">
            <p>
              Still have a question? The complete range of services is at{' '}
              <a href={servicesCta.href} target="_blank" rel="noopener noreferrer">
                transformations123.com
              </a>
              , or bring it to an initial call.
            </p>
            <BookButton label={ctas.hero} />
          </div>
        </div>
      </section>

      <ClosingBand />
    </>
  )
}
