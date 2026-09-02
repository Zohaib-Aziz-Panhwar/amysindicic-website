import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../lib/motion.js'

/**
 * Types `text` out one character at a time.
 *
 * A hidden copy of the full string holds the final size, so the line count
 * never changes while typing and nothing below it shifts. The visible letters
 * are aria-hidden and the full text is exposed once via aria-label, so screen
 * readers get the sentence in one piece rather than character by character.
 */
export default function Typewriter({
  text,
  speed = 26,
  startDelay = 550,
  className = '',
}) {
  const reduced = usePrefersReducedMotion()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (reduced) { setCount(text.length); return }
    setCount(0)
    let i = 0
    let tick
    const step = () => {
      i += 1
      setCount(i)
      if (i < text.length) {
        // Pause a little longer on sentence punctuation — reads more naturally.
        const ch = text[i - 1]
        tick = setTimeout(step, /[.,]/.test(ch) ? speed * 7 : speed)
      }
    }
    const start = setTimeout(step, startDelay)
    return () => { clearTimeout(start); clearTimeout(tick) }
  }, [text, speed, startDelay, reduced])

  const done = count >= text.length

  return (
    <span className={`typewriter ${className}`}>
      <span className="typewriter__ghost" aria-hidden="true">{text}</span>
      <span className="typewriter__live" aria-label={text} role="text">
        <span aria-hidden="true">{text.slice(0, count)}</span>
        {!reduced && (
          <span
            className={`typewriter__caret ${done ? 'typewriter__caret--done' : ''}`}
            aria-hidden="true"
          />
        )}
      </span>
    </span>
  )
}
