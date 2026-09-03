import { PageHero, ClosingBand, Placeholder } from '../components/Common.jsx'
import { useTitle } from '../lib/useTitle.js'

// Privacy Policy and Terms of Service are linked from the footer in the design
// but have no supplied copy; both render the same placeholder shell.
export default function Legal({ title }) {
  useTitle(title)
  return (
    <>
      <PageHero title={title} />
      <section className="section">
        <div className="wrap prose">
          <Placeholder label={`${title} — legal copy to be supplied by client`}>
            <p>
              This page is linked from the footer of the approved design. Legal
              wording should be provided by the client or their legal adviser.
            </p>
          </Placeholder>
        </div>
      </section>
      <ClosingBand />
    </>
  )
}
