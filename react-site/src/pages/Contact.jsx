import { useSearchParams } from 'react-router-dom'
import { PageHero, Reveal } from '../components/ui'
import { EMAIL, LINKEDIN } from '../data'
const PROGRAMS = [['call', 'A discovery call — help me choose'], ['direction', 'Executive Career Direction ($149)'], ['positioning', 'Executive Positioning & Branding ($249)'], ['complete', 'Complete Executive Transition ($599)'], ['ses', 'SES package (résumé, ECQs, TQs)']]
export default function Contact() {
  const [sp] = useSearchParams(); const pre = sp.get('program') || 'call'
  const submit = (e) => { e.preventDefault(); const d = new FormData(e.target); const prog = PROGRAMS.find(([k]) => k === d.get('program'))?.[1]
    const body = `Name: ${d.get('name')}\nEmail: ${d.get('email')}\nCurrent role: ${d.get('role')}\nInterested in: ${prog}\n\n${d.get('message')}`
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Discovery call request — ' + d.get('name'))}&body=${encodeURIComponent(body)}` }
  return (<main>
    <PageHero crumb="Contact" eyebrow="Book a discovery call" title={<>Ready for <em>a change?</em></>} lede="Tell Amy where you are and where you want to go. She'll reply personally to schedule a complimentary consultation." />
    <section className="section"><div className="wrap contact">
      <Reveal><span className="eyebrow">What happens next</span><h2 style={{ fontSize: 'clamp(30px,3.6vw,44px)', margin: '14px 0 18px' }}>A 20-minute conversation, no pitch.</h2>
        <p className="lede" style={{ fontSize: 17 }}>You'll talk through your background, your target, and the honest gap between the two. If a program fits, Amy will recommend one. If it doesn't, she'll tell you that too.</p>
        <div className="contact-list"><div><b>Email</b><a href={`mailto:${EMAIL}`}>{EMAIL}</a></div><div><b>LinkedIn</b><a href={LINKEDIN} target="_blank" rel="noopener">linkedin.com/in/amy-sindicic-career-strategist</a></div><div><b>Location</b><span>Washington DC – Baltimore area · sessions online worldwide</span></div></div></Reveal>
      <Reveal as="form" className="form" onSubmit={submit} delay={.1}>
        <div className="row"><label>Name <input name="name" required autoComplete="name" /></label><label>Email <input name="email" type="email" required autoComplete="email" /></label></div>
        <label>Current role / grade <input name="role" placeholder="e.g. GS-15 Program Director, O-6 retiring 2027" /></label>
        <label>I'm interested in <select name="program" defaultValue={pre}>{PROGRAMS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
        <label>Where do you want to go? <textarea name="message" rows="5" placeholder="Target roles, industries, timeline — anything that helps Amy prepare." /></label>
        <button className="btn btn--primary" type="submit" style={{ justifyContent: 'center' }}>Request my discovery call</button>
        <p style={{ fontSize: 13, color: 'var(--slate)' }}>Submitting opens a pre-filled email to Amy from your mail app. Your details go only to her.</p>
      </Reveal>
    </div></section>
  </main>)
}
