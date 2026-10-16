import { Link } from 'react-router-dom'
import { hero, APPLY_PATH } from '../data/content.js'

/**
 * "Book A Strategy Call" CTA. Leads to the in-app application form (/apply),
 * which collects Amy's qualifying questions and then opens the calendar.
 * Used everywhere the CTA appears.
 */
export default function BookButton({ className = 'btn', label = hero.cta, ...rest }) {
  return (
    <Link className={className} to={APPLY_PATH} {...rest}>
      {label}
    </Link>
  )
}
