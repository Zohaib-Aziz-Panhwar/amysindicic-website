import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import { PageHero, ClosingBand, Reveal } from '../components/Common.jsx'
import ReadingProgress from '../components/ReadingProgress.jsx'
import { posts } from '../data/content.js'
import { asset } from '../lib/asset.js'

const formatDate = (iso) =>
  new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

/** Roughly 200 words a minute, rounded up. */
function readingTime(body) {
  const words = body.reduce((n, b) => {
    const text = b.items ? b.items.join(' ') : (b.text || '')
    return n + text.trim().split(/\s+/).length
  }, 0)
  return Math.max(1, Math.round(words / 200))
}

// Watermark placement down the article gutters. Fixed offsets rather than
// percentages, so the spacing stays even however long the piece runs.
const DECO = [
  { src: '/images/bf-audience.png', side: 'l', top: 30,   w: '25%', o: 0.34 },
  { src: '/images/bf-banner.png',   side: 'r', top: 430,  w: '29%', o: 0.30 },
  { src: '/images/bf-approach.png', side: 'l', top: 980,  w: '20%', o: 0.26 },
  { src: '/images/bf-closing.png',  side: 'r', top: 1450, w: '19%', o: 0.28 },
  { src: '/images/bf-audience.png', side: 'l', top: 1960, w: '22%', o: 0.24 },
  { src: '/images/bf-banner.png',   side: 'r', top: 2500, w: '26%', o: 0.22 },
  { src: '/images/bf-approach.png', side: 'l', top: 3060, w: '19%', o: 0.20 },
]

function Card({ post, showExcerpt = true }) {
  return (
    <Link to={`/blog/${post.slug}`} className="post">
      <span className="post__frame">
        <img src={post.image} alt="" loading="lazy" />
      </span>
      <span className="post__body">
        <time className="post__date" dateTime={post.date}>{formatDate(post.date)}</time>
        <h3>{post.title}</h3>
        {showExcerpt && <span className="post__excerpt">{post.excerpt}</span>}
        <span className="post__more">Read more <span aria-hidden="true">&rarr;</span></span>
      </span>
    </Link>
  )
}

/** How many page numbers to show on a phone before the "+". */
const VISIBLE_ON_NARROW = 4

/** Nine posts a page on a laptop, four on a phone. */
function usePerPage() {
  const query = '(max-width: 700px)'
  const [n, setN] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(query).matches ? 4 : 9
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setN(mq.matches ? 4 : 9)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return n
}

export function BlogIndex() {
  const [params, setParams] = useSearchParams()
  const perPage = usePerPage()
  const topRef = useRef(null)

  const pageCount = Math.max(1, Math.ceil(posts.length / perPage))
  // Clamped, so a deep page stays valid when the count changes on resize.
  const page = Math.min(Math.max(1, Number(params.get('page')) || 1), pageCount)
  const start = (page - 1) * perPage
  const shown = posts.slice(start, start + perPage)

  // On a phone the row of numbers gets long, so only the first four show
  // until the reader taps "+". Auto-expanded if they are already past page 4.
  const isNarrow = perPage === 4
  const [expanded, setExpanded] = useState(false)
  const collapsed = isNarrow && !expanded && pageCount > VISIBLE_ON_NARROW && page <= VISIBLE_ON_NARROW
  const numbers = Array.from({ length: pageCount }, (_, i) => i + 1)
  const visibleNumbers = collapsed ? numbers.slice(0, VISIBLE_ON_NARROW) : numbers

  const goTo = (n) => {
    setParams(n === 1 ? {} : { page: String(n) })
    // The route itself has not changed, so scroll back to the list by hand.
    const top = topRef.current
    if (top) {
      window.scrollTo({ top: top.offsetTop - 90, behavior: 'smooth' })
    }
  }

  return (
    <>
      <PageHero
        title="Blog"
        text="Practical thinking on executive positioning, career transitions and the mechanics of a senior-level move."
      />
      <section className="section blog" ref={topRef}>
        <div className="wrap">
          <div className="blog-grid blog-grid--index">
            {shown.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 3) * 70}>
                <Card post={p} />
              </Reveal>
            ))}
          </div>

          {pageCount > 1 && (
            <nav className="pager" aria-label="Blog pages">
              <button
                type="button"
                className="pager__step"
                onClick={() => goTo(page - 1)}
                disabled={page === 1}
              >
                <span aria-hidden="true">&larr;</span> Prev
              </button>

              <span className="pager__nums">
                {visibleNumbers.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`pager__num ${n === page ? 'is-current' : ''}`}
                    aria-current={n === page ? 'page' : undefined}
                    aria-label={`Page ${n}`}
                    onClick={() => goTo(n)}
                  >
                    {n}
                  </button>
                ))}
                {collapsed && (
                  <button
                    type="button"
                    className="pager__num pager__more"
                    onClick={() => setExpanded(true)}
                    aria-label={`Show the remaining ${pageCount - VISIBLE_ON_NARROW} pages`}
                  >
                    +
                  </button>
                )}
              </span>

              <button
                type="button"
                className="pager__step"
                onClick={() => goTo(page + 1)}
                disabled={page === pageCount}
              >
                Next <span aria-hidden="true">&rarr;</span>
              </button>
            </nav>
          )}

          <p className="pager__count">
            Showing {start + 1}&ndash;{Math.min(start + perPage, posts.length)} of {posts.length} posts
          </p>
        </div>
      </section>
      <ClosingBand />
    </>
  )
}

export function BlogPost() {
  const { slug } = useParams()
  const index = posts.findIndex((p) => p.slug === slug)
  if (index === -1) return <Navigate to="/404" replace />

  const post = posts[index]
  const newer = posts[index - 1]
  const older = posts[index + 1]
  const more = posts.filter((p) => p.slug !== slug).slice(0, 3)

  // The opening paragraph is set as a lead; the rest reads at body size.
  const [lead, ...rest] = post.body
  const leadIsText = lead && lead.t === 'p'

  const renderBlock = (b, i) => {
    if (b.t === 'h') return <h2 key={i}>{b.text}</h2>
    if (b.t === 'quote') return <blockquote key={i}>{b.text}</blockquote>
    if (b.t === 'ul') {
      return <ul key={i}>{b.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
    }
    // A paragraph the author broke with line breaks — keep its shape.
    if (b.t === 'lines') {
      return (
        <p key={i} className="article-lines">
          {b.items.map((it, j) => (
            <span key={j}>{it}{j < b.items.length - 1 && <br />}</span>
          ))}
        </p>
      )
    }
    return <p key={i}>{b.text}</p>
  }

  return (
    <>
      <ReadingProgress />

      <header className="article-hero">
        <div className="wrap article-hero__inner">
          <Link to="/blog" className="article-hero__back">
            <span aria-hidden="true">&larr;</span> Blog
          </Link>
          <p className="article-hero__meta">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span className="dot" aria-hidden="true" />
            {readingTime(post.body)} min read
          </p>
          <h1>{post.title}</h1>
          <hr className="article-hero__rule" />
        </div>
      </header>

      <article className="article-wrap">
        {/* Faint brand watermark in the side gutters. Sits behind the reading
            column at low opacity and is dropped once the gutters disappear. */}
        <div className="article-deco" aria-hidden="true">
          {DECO.map((d, i) => (
            <img
              key={i}
              className={`article-deco__bf article-deco__bf--${d.side}`}
              src={asset(d.src)}
              alt=""
              style={{ top: d.top, width: d.w, opacity: d.o, animationDelay: `${-i * 2.6}s` }}
            />
          ))}
        </div>

        <figure className="article-figure">
          <img src={post.image} alt="" />
        </figure>

        <div className="article-body">
          {leadIsText && <p className="article-lead">{lead.text}</p>}
          {(leadIsText ? rest : post.body).map(renderBlock)}

          <p className="article-source">
            Originally published on{' '}
            <a href={post.source} target="_blank" rel="noopener noreferrer">
              amysindicic.com
            </a>
          </p>
        </div>

        {(newer || older) && (
          <nav className="article-nav" aria-label="More articles">
            {newer ? (
              <Link to={`/blog/${newer.slug}`} className="article-nav__item">
                <span className="article-nav__dir">&larr; Newer</span>
                <span className="article-nav__title">{newer.title}</span>
              </Link>
            ) : <span />}
            {older && (
              <Link to={`/blog/${older.slug}`} className="article-nav__item article-nav__item--next">
                <span className="article-nav__dir">Older &rarr;</span>
                <span className="article-nav__title">{older.title}</span>
              </Link>
            )}
          </nav>
        )}
      </article>

      <section className="section blog">
        <div className="wrap">
          <h2 className="sec-title">More From The Blog</h2>
          <div className="blog-grid">
            {more.map((p) => <Card key={p.slug} post={p} showExcerpt={false} />)}
          </div>
        </div>
      </section>

      <ClosingBand />
    </>
  )
}
