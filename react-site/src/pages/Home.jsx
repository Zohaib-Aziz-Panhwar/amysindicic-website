import Hero from '../components/Hero'
import { Badges, Ticker, Statement, Compare, Framework, MeetAmy, Land, Tiers, Testimonials, Results, CaseGrid, Dual, Posts } from '../components/Sections'
import { SectionHead, Reveal } from '../components/ui'
import { Link } from 'react-router-dom'
import { CASES } from '../data'
export default function Home() {
  return (<main>
    <Hero /><Badges /><Ticker /><Statement /><Compare /><Framework /><MeetAmy /><Land />
    <section className="section" id="services"><div className="wrap">
      <SectionHead eyebrow="Work with Amy" title="Three ways to work together"><p className="lede">Every engagement is one-to-one with Amy. Choose the level of support that matches where you are in the transition.</p></SectionHead>
      <Tiers compact picker />
      <Reveal as="p" className="tiers-note"><span className="limited"><i />Amy works with a limited number of 1:1 clients at a time.</span> Also available: SES packages (résumé, ECQs, TQs) and group workshops for transition programs. <Link to="/contact">Ask on a discovery call.</Link></Reveal>
    </div></section>
    <Testimonials /><Results /><CaseGrid items={CASES.slice(2)} /><Dual /><Posts />
  </main>)
}
