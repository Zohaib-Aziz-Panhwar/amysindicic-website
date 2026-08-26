import { Link } from 'react-router-dom'
import { PageHero, Reveal } from '../components/ui'
import { CaseGrid } from '../components/Sections'
export default function CaseStudies() {
  return (<main>
    <PageHero crumb="Case Studies" eyebrow="Case studies" title={<>Leaders who <em>made the move.</em></>} lede={'Names changed for privacy. Each of these leaders arrived with decades of accomplishment and the same quiet question: "Maybe I\'m not what they\'re looking for."'} />
    <section className="section"><div className="wrap"><CaseGrid section={false} /></div></section>
    <section className="section alt" id="michael"><Reveal className="wrap case-full">
      <span className="eyebrow">Case study #3 · GS-15 → SES</span><h2 style={{ marginTop: 14 }}>Michael: "Maybe I'm not what they're looking for."</h2>
      <p>When Michael contacted Amy, he was not looking for help writing Executive Core Qualifications. He was looking for an explanation. After nearly 30 years in federal service, he believed he had done everything necessary to position himself for Senior Executive Service opportunities. He had led large organizations, managed multimillion-dollar budgets, directed complex operations and advised senior leaders.</p>
      <p>On paper, Michael looked like exactly the type of leader who should have been competitive for SES. Yet applications produced inconsistent results. Some generated referrals. A few led to interviews. Most led nowhere. The more accomplished he became, the less sense the results seemed to make.</p>
      <h2>The challenge</h2>
      <p>Like many senior government leaders, Michael viewed his career through the lens of responsibility rather than impact. He could easily explain the size of the budgets he managed and the programs he oversaw. What he struggled to explain was something much more important: the significance of his leadership.</p>
      <blockquote>Michael could clearly see everything he had done. He could not clearly see what those accomplishments revealed about his leadership.</blockquote>
      <p>Throughout their conversations, Michael repeatedly described some of the most important accomplishments of his career as though they were routine assignments — projects that had required strategic influence, stakeholder alignment and organizational change.</p>
      <h2>The turning point</h2>
      <p>Amy rebuilt his ECQ narratives around leadership outcomes rather than duties: what changed because Michael led, who he aligned, what risk he managed. The result was a package that finally let a review board see an executive — and the referrals and interviews that followed reflected it.</p>
      <p><Link className="btn btn--ghost" to="/contact">Talk to Amy about SES positioning</Link></p>
    </Reveal></section>
    <section className="section" id="david"><Reveal className="wrap case-full">
      <span className="eyebrow">Case study #4 · Expert → Executive</span><h2 style={{ marginTop: 14 }}>David: "I thought results would speak for themselves."</h2>
      <p>When David contacted Amy, he was not looking for executive coaching. He was looking for answers. After more than 25 years of leadership spanning military service and civilian employment, he had led large teams, managed complex operations, delivered measurable results and built a strong reputation for getting things done.</p>
      <p>Over an eighteen-month period, David interviewed for several senior leadership positions. He consistently advanced, received positive feedback, and was often considered a strong candidate. Yet the final offer always seemed to go to someone else.</p>
      <h2>The challenge</h2>
      <p>Like many highly accomplished leaders, David viewed his career through the lens of expertise rather than leadership. He could explain projects, responsibilities, technical challenges and operational successes. What he struggled to explain was the broader impact of his leadership.</p>
      <blockquote>David saw execution. Amy saw executive potential.</blockquote>
      <h2>The turning point</h2>
      <p>During a coaching session, David briefly mentioned an initiative he had led several years earlier — to him, simply another successful project. As Amy asked questions, a very different story emerged: competing priorities, organizational resistance, multiple stakeholders and significant pressure from leadership. David had aligned decision-makers, built consensus and moved the initiative forward.</p>
      <p>Once that story — and a dozen like it — was reframed as strategic influence, organizational change and business impact, David's interviews changed. He stopped being the strong candidate who narrowly missed, and became the leader they hired.</p>
      <p><Link className="btn btn--ghost" to="/contact">Start your own transition</Link></p>
    </Reveal></section>
    <section className="section alt" id="jim">
      <Reveal className="wrap case-full"><span className="eyebrow">Case study #1 · Service → Senior leadership</span><h2 style={{ marginTop: 14 }}>Jim: from service to senior leadership</h2>
        <p>Jim's military record read as a list of commands and billets. Amy translated it into an operations-leadership narrative — scope, headcount, budget, outcomes — and targeted director-level roles that matched his real level. The interviews that followed were for the job he deserved, not two levels below it.</p></Reveal>
      <Reveal className="wrap case-full" id="francine" style={{ marginTop: 56 }}><span className="eyebrow">Case study #2 · GS-14 → Executive leadership</span><h2 style={{ marginTop: 14 }}>Francine: from GS-14 to executive leadership</h2>
        <p>Francine's résumé called her a program manager. Her work — multimillion-dollar budgets, cross-agency stakeholders, regulatory oversight — called her an enterprise leader. Amy repositioned her value proposition, rebuilt her LinkedIn presence and prepared her for corporate interviews. She transitioned into an executive role with stronger compensation, autonomy and growth potential.</p></Reveal>
    </section>
  </main>)
}
