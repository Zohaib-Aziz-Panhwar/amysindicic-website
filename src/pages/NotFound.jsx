import { Link } from 'react-router-dom'
import { PageHero } from '../components/Common.jsx'
import BookButton from '../components/BookButton.jsx'

export default function NotFound() {
  return (
    <>
      <PageHero
        title="Page not found"
        text="The page you were looking for isn’t here. These are the places worth heading instead."
      />
      <section className="section">
        <div className="wrap center">
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn--dark">Back to home</Link>
            <Link to="/blog" className="btn">Read the blog</Link>
            <BookButton label="Book a discovery call" />
          </div>
        </div>
      </section>
    </>
  )
}
