import { PageHero } from '../components/ui'
import { PostCard } from '../components/Sections'
import { POSTS } from '../data'
export default function Blog() {
  return (<main>
    <PageHero crumb="Blog" eyebrow="Insights" title={<>Thinking for leaders <em>in transition.</em></>} lede="Short, direct essays on how executive hiring actually works — and how to position for it." />
    <section className="section"><div className="wrap"><div className="posts">{POSTS.map((p, i) => <PostCard key={p.title} p={p} i={i} />)}</div></div></section>
  </main>)
}
