import { Link } from 'react-router-dom'
import { Reveal, ClosingBand } from '../components/Common.jsx'
import { asset } from '../lib/asset.js'

/* Where Calendly sends people once the appointment is confirmed. The branded
   image carries the full message; links below it keep people on the site. */
export default function Booked() {
  return (
    <>
      <section className="section booked-section">
        <div className="wrap">
          <Reveal>
            <img
              className="booked-img"
              src={asset('/images/booked-congrats.jpg')}
              alt="Congratulations! Your appointment has been successfully booked. I'll email you the meeting details and send a Zoom link before our scheduled time. — Amy"
            />
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
