import { site, hero } from '../data/content.js'

/**
 * "Book a Discovery Call" CTA. Opens Amy's SimplyBook scheduling page in a new
 * tab so the visitor doesn't lose the site. Used everywhere the CTA appears.
 */
export default function BookButton({ className = 'btn', label = hero.cta, ...rest }) {
  return (
    <a
      className={className}
      href={site.bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      {...rest}
    >
      {label}
    </a>
  )
}
