import { PageHero, SectionHead, Reveal, useVideo } from '../components/ui'
import { Testimonials } from '../components/Sections'
import { QUOTES } from '../data'
export default function About() {
  const openVideo = useVideo()
  return (<main>
    <PageHero crumb="About" eyebrow="About Amy" title={<>Why government workers <em>trust Amy.</em></>} lede="Government leaders face a complex transition: how do you translate years of public service, authority and responsibility into language that resonates in the private sector — without minimizing your scope or impact? That is where Amy provides strategic clarity." />
    <section className="section"><div className="wrap about">
      <Reveal className="about__side">
        <div className="avatar-card"><img className="avatar" src="assets/img/amy-portrait.jpg" alt="Amy Sindicic" /><b>Amy Sindicic</b><span>Career Strategist · Executive Résumé Writer · Interview Advisor</span><img className="logo" src="assets/brand/logo.png" alt="Transformations 123" /></div>
        <a className="video" href="#" onClick={(e) => { e.preventDefault(); openVideo() }} aria-label="Watch: Your Federal Exit Strategy"><img src="assets/img/public-private.jpg" alt="" /><span><span><i><svg width="22" height="22" viewBox="0 0 24 24" fill="#0B1B3A"><path d="M8 5v14l11-7z" /></svg></i>Watch: Your Federal Exit Strategy</span></span></a>
      </Reveal>
      <Reveal><span className="eyebrow">The story</span>
        <h2>Analytical and supportive — grounded in strategy, precision and measurable outcomes.</h2>
        <p><strong>Amy Sindicic helps government and military professionals transition into private-sector leadership roles</strong> by clarifying their value, strengthening their positioning, and aligning their résumés, LinkedIn profiles and interview strategies to today's market expectations.</p>
        <p>With expertise in career positioning, communication and executive branding, Amy helps federal, state and local professionals reframe their experience into market-ready narratives that align with private-sector expectations.</p>
        <p>Before career strategy, Amy spent decades as a university English professor, teaching professionals to communicate with clarity and precision. That background is why her clients sound different in interviews: their experience isn't just listed — it's argued.</p>
        <p>She has worked globally across four continents, supporting senior professionals in articulating complex experience with confidence. She has helped leaders secure competitive roles across industries and guided high-achieving professionals through demanding career pivots with structured strategy and measurable outcomes.</p>
        <p>She believes career growth — like physical training — requires discipline, strategy, accountability and consistent execution. <strong>Real transformation doesn't happen by accident.</strong></p>
        <div className="creds">{['Certified Career & Life Coach', 'Certified Résumé Writer', 'Certified Interview Coach', "Master's in Marketing", "Master's in Education · retired university ESL professor", 'Based in the Washington DC – Baltimore area · clients on four continents'].map((c) => <div key={c}>{c}</div>)}</div>
      </Reveal></div></section>
    <section className="section alt"><div className="wrap"><SectionHead eyebrow="How Amy works" title="Three things clients notice first" />
      <div className="pillars" style={{ marginTop: 0 }}>
        {[['She understands your environment.', 'Amy knows how government roles operate and how to translate mission-driven experience into business value — program management, regulatory oversight, stakeholder alignment, budgeting, operations and leadership.'], ['She builds positioning, not just documents.', 'Whether you are targeting corporate leadership, consulting, compliance, healthcare administration or operations, Amy helps you present yourself as credible, competitive and ready to lead.'], ['She focuses on outcomes.', 'Her clients gain clarity, confidence and traction — often securing interviews quickly and transitioning into roles with stronger compensation, autonomy and growth potential.']].map(([h, p], i) => <Reveal key={h} className="pillar" delay={i * .1}><h3>{h}</h3><p>{p}</p></Reveal>)}
      </div></div></section>
    <Testimonials featured={false} items={QUOTES.slice(0, 3)} />
  </main>)
}
