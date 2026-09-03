import { useEffect } from 'react'
import { site } from '../data/content.js'

/**
 * Sets the browser tab title for a page, e.g. "Blog – Amy Sindicic".
 * Pass nothing on the home page's own landing title if it should stand alone.
 */
export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} – ${site.name}` : site.name
  }, [title])
}
