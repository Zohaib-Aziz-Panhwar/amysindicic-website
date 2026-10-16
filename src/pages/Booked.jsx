import { Link } from 'react-router-dom'
import { PageHero, Reveal, ClosingBand } from '../components/Common.jsx'

/* Where Calendly sends people once the appointment is confirmed. */
export default function Booked() {
  return (
    <>
      <PageHero
        title="Congratulations!"
        text="Your appointment has been successfully booked."
      />
      <section className="section">
        <div className="wrap booked-wrap">
          <Reveal>
            <p>
              I will email you the meeting details. Please check your inbox to make sure
              you have everything you need to join. My messages sometimes land in spam or
              junk folders, so do add my address to your safe sender list so the call
              details reach you.
            </p>
            <p>
              I will send a Zoom link shortly before our scheduled time, and I will use the
              phone number you provided as a backup.
            </p>
            <p>I look forward to meeting with you.</p>
            <p className="booked-sign">Amy</p>
            <div className="booked-links">
              <Link className="btn" to="/blog">Read the blog &rarr;</Link>
              <Link className="btn btn--dark" to="/">Back to home</Link>
            </div>
          </Reveal>
        </div>
      </section>
      <ClosingBand />
    </>
  )
}
