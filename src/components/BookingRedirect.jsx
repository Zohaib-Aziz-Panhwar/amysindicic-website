import { useEffect } from 'react'
import { site } from '../data/content.js'

/**
 * Old /contact links now lead to Amy's SimplyBook scheduling page.
 * Kept as a route so existing links and bookmarks don't 404.
 */
export default function BookingRedirect() {
  useEffect(() => { window.location.replace(site.bookingUrl) }, [])
  return (
    <section className="page-hero">
      <div className="wrap">
        <h1>Opening the booking calendar…</h1>
        <p>
          If nothing happens,{' '}
          <a href={site.bookingUrl} style={{ color: 'var(--gold)', fontWeight: 700 }}>
            open Amy&rsquo;s scheduling page
          </a>.
        </p>
      </div>
    </section>
  )
}
