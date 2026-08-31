import { Link, Navigate, useParams } from 'react-router-dom'
import { PageHero, ClosingBand, Reveal, Placeholder } from '../components/Common.jsx'
import { posts, blogHeading } from '../data/content.js'

/** Blog index — the four posts shown in the design. */
export function BlogIndex() {
  return (
    <>
      <PageHero title="Blog" />
      <section className="section blog">
        <div className="wrap">
          <h2 className="sec-title">{blogHeading}</h2>
          <div className="blog-grid">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 70}>
                <Link to={`/blog/${p.slug}`} className="post">
                  <img src={p.image} alt="" />
                  <h3>{p.title}</h3>
                </Link>
              </Reveal>
            ))}
          </div>
          <div style={{ marginTop: 'clamp(22px, 3vw, 40px)' }}>
            <Placeholder label="Further posts to be supplied by client">
              <p>
                The design shows four posts. Add more entries to <code>posts</code> in{' '}
                <code>src/data/content.js</code> and they will appear here automatically.
              </p>
            </Placeholder>
          </div>
        </div>
      </section>
      <ClosingBand />
    </>
  )
}

/** Single post. */
export function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)
  if (!post) return <Navigate to="/404" replace />

  const others = posts.filter((p) => p.slug !== slug)

  return (
    <>
      <PageHero title={post.title} />
      <section className="section">
        <div className="wrap prose">
          <img src={post.image} alt="" style={{ width: '100%', marginBottom: 26 }} />
          <Placeholder label="Article body to be supplied by client">
            <p>
              The design supplies this post&rsquo;s title and thumbnail only. Add the body
              text as a <code>body: []</code> array on this post in{' '}
              <code>src/data/content.js</code>.
            </p>
          </Placeholder>
          <p style={{ marginTop: 30 }}>
            <Link to="/blog" style={{ color: 'var(--gold-dark)', fontWeight: 700 }}>
              &larr; Back to all posts
            </Link>
          </p>
        </div>
      </section>

      <section className="section blog">
        <div className="wrap">
          <h2 className="sec-title">More From The Blog</h2>
          <div className="blog-grid">
            {others.map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`} className="post">
                <img src={p.image} alt="" />
                <h3>{p.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <ClosingBand />
    </>
  )
}
