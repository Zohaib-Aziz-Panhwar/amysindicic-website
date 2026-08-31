/**
 * Resolves a /public asset against Vite's base path.
 * On GitHub Pages the site is served from a sub-directory, so a bare
 * "/images/x.jpg" would resolve against the domain root and 404.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

export function asset(path) {
  return BASE + (path.startsWith('/') ? path : `/${path}`)
}
