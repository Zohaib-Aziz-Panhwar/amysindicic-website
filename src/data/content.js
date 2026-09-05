/**
 * The site's content.
 *
 * public/content/content.json and posts.json are the source of truth, and they
 * are FETCHED AT RUNTIME rather than bundled -- that is what lets the editor
 * change the live site by writing two files, with no rebuild. main.jsx loads
 * them before this module is ever imported and leaves them on window; see
 * loadContent() there.
 *
 * This module only re-exports them under the names the pages already import,
 * and resolves stored image paths ("/images/x.jpg") through the base path.
 */
import { asset } from '../lib/asset.js'

const store = globalThis.__SITE_CONTENT__
if (!store) {
  throw new Error(
    'Site content was not loaded. main.jsx must fetch it before importing this module.',
  )
}
const data = store.content
const postsData = store.posts

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
