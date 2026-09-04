/**
 * The site's content, loaded from the JSON the admin panel edits.
 *
 * content.json and posts.json are the source of truth. This module only
 * re-exports them under the names the pages already import, and resolves the
 * stored image paths ("/images/x.jpg") through Vite's base path, which differs
 * between local dev and the GitHub Pages sub-directory.
 *
 * Editing the JSON by hand is fine; the admin panel writes the same shape.
 */
import { asset } from '../lib/asset.js'
import data from './content.json'
import postsData from './posts.json'

export const site = data.site
export const ctas = data.ctas
export const socials = data.socials
export const nav = data.nav
export const banner = data.banner
export const servicesHeading = data.servicesHeading
export const services = data.services
export const servicesCta = data.servicesCta
export const audiences = data.audiences
export const approachHeading = data.approachHeading
export const approach = data.approach
export const blogHeading = data.blogHeading
export const blogCta = data.blogCta
export const closing = data.closing
export const footer = data.footer
export const faqHeading = data.faqHeading
export const faqIntro = data.faqIntro
export const faqs = data.faqs

export const hero = { ...data.hero, photo: asset(data.hero.photo) }
export const about = { ...data.about, portrait: asset(data.about.portrait) }

// An empty photo falls back to an initials monogram, so keep it empty.
export const testimonials = data.testimonials.map((t) => ({
  ...t,
  photo: t.photo ? asset(t.photo) : '',
}))

export const posts = postsData.map((p) => ({
  ...p,
  image: p.image ? asset(p.image) : '',
}))
