/**
 * Blog and testimonial bodies are stored as typed blocks. Editors get one
 * plain textarea instead, using a small convention, and we convert both ways:
 *
 *   ## Heading        -> { t: 'h' }
 *   > Pull quote      -> { t: 'quote' }
 *   - item            -> { t: 'ul', items: [] }   (consecutive lines)
 *   anything else     -> { t: 'p' }
 *
 * A block whose lines were hard-broken in the original ({ t: 'lines' }) is
 * preserved on the way back out when its shape is unchanged.
 */
export function blocksToText(body = []) {
  return body
    .map((b) => {
      if (b.t === 'h') return `## ${b.text}`
      if (b.t === 'quote') return `> ${b.text}`
      if (b.t === 'ul') return b.items.map((i) => `- ${i}`).join('\n')
      if (b.t === 'lines') return b.items.join('\n')
      return b.text
    })
    .join('\n\n')
}

export function textToBlocks(text) {
  return String(text)
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean)
      if (lines.every((l) => l.startsWith('- '))) {
        return { t: 'ul', items: lines.map((l) => l.slice(2).trim()) }
      }
      if (lines.length > 1) return { t: 'lines', items: lines }
      const [line] = lines
      if (line.startsWith('## ')) return { t: 'h', text: line.slice(3).trim() }
      if (line.startsWith('> ')) return { t: 'quote', text: line.slice(2).trim() }
      return { t: 'p', text: line }
    })
}

/** Testimonial quotes are a plain array of paragraphs. */
export const paragraphsToText = (arr = []) => arr.join('\n\n')
export const textToParagraphs = (text) =>
  String(text).split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean)

/** "The Visibility Gap: Why…" -> "the-visibility-gap-why…" */
export function slugify(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
