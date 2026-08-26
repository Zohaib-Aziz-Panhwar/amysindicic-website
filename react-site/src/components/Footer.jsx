import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { EMAIL, LINKEDIN, SOCIAL } from '../data'
import { Arrow } from './ui'
export function Newsletter() {
  const submit = (e) => { e.preventDefault(); const em = e.target.email.value; location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Send me the résumé template + 10 days of writing tips')}&body=${encodeURIComponent('Please add me to the list: ' + em)}` }
  return (
    <section className="newsletter"><div className="wrap">
      <div><span className="eyebrow" style={{ color: 'var(--navy)' }}>Free · résumé template + 10 days of expert writing tips</span>
        <h2>Join leaders receiving Amy's private-sector transition series</h2>
        <p>The exact ATS-friendly template Amy uses with clients, followed by ten short daily lessons on writing your impact in plain, private-sector language.</p></div>
      <form className="nl-form" onSubmit={submit}><input name="email" type="email" required placeholder="Your best email" aria-label="Email" /><button className="btn" type="submit">Send me the template</button><small>No spam. Unsubscribe any time.</small></form>
    </div></section>
  )
}
export function CTA() {
  return (
    <section className="section dark cta" id="book"><div className="wrap">
      <span className="eyebrow">Book a discovery call</span>
      <h2>Your experience is in demand. <em>Let's position it right.</em></h2>
      <p className="lede">A complimentary consultation to hear where you want to go — and an honest read on what it will take to get there.</p>
      <div className="cta__actions">
        <Link className="btn btn--primary" to="/contact">Book a discovery call <Arrow /></Link>
        <a className="btn btn--ghost" href={LINKEDIN} target="_blank" rel="noopener">Connect on LinkedIn</a>
      </div>
      <p className="cta__mail">Or email directly: <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
    </div></section>
  )
}
export function SlideIn() {
  const { pathname } = useLocation(); const [show, setShow] = useState(false)
  useEffect(() => {
    let dismissed = false; try { dismissed = sessionStorage.getItem('t123-offer') === '1' } catch {}
    if (dismissed || pathname.includes('resources')) return
    const f = () => { const h = document.documentElement; if (h.scrollTop / (h.scrollHeight - h.clientHeight) > .35) { setShow(true); removeEventListener('scroll', f) } }
    addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f)
  }, [pathname])
  const close = () => { setShow(false); try { sessionStorage.setItem('t123-offer', '1') } catch {} }
  return (
    <div className={'slidein' + (show ? ' show' : '')} role="dialog" aria-label="Free résumé template">
      <button className="slidein__x" aria-label="Close" onClick={close}>×</button>
      <img src="assets/img/lib-resume-template-thumbnail.png" alt="" />
      <div><b>Free: the private-sector résumé template</b><p>The exact template Amy uses with clients, plus 10 days of writing tips.</p><Link className="btn btn--primary" to="/resources" onClick={close}>Get the template</Link></div>
    </div>
  )
}
export function StickyCta() {
  const [show, setShow] = useState(false)
  useEffect(() => { const f = () => setShow(scrollY > 700); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])
  return <div className={'sticky-cta' + (show ? ' show' : '')}><span>Free discovery call</span><Link className="btn btn--primary" to="/contact">Book now</Link></div>
}
export default function Footer() {
  return (<>
    <Newsletter /><CTA />
    <footer className="footer"><div className="wrap">
      <div>
        <Link className="brand" to="/"><img src="assets/brand/butterfly-badge.png" alt="" /><span><b>Amy Sindicic</b><small>Transformations 123</small></span></Link>
        <p style={{ maxWidth: '38ch' }}>Career strategist, executive résumé writer and interview advisor for government and military leaders entering the private sector. Washington DC – Baltimore, and remote worldwide.</p>
      </div>
      <div><h4>Programs</h4><ul><li><Link to="/services#direction">Executive Career Direction</Link></li><li><Link to="/services#positioning">Positioning & Branding</Link></li><li><Link to="/services#complete">Complete Executive Transition</Link></li><li><Link to="/resources#ses">SES materials</Link></li></ul></div>
      <div><h4>Explore</h4><ul><li><Link to="/about">About Amy</Link></li><li><Link to="/case-studies">Case studies</Link></li><li><Link to="/resources">Free resources</Link></li><li><Link to="/blog">Blog</Link></li><li><Link to="/contact">Contact</Link></li></ul></div>
      <div><h4>Connect</h4><ul>{SOCIAL.map(([n, h]) => <li key={n}><a href={h} target="_blank" rel="noopener">{n}</a></li>)}<li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li></ul></div>
      <div className="footer__bottom"><span>© 2026 Amy Sindicic · Transformations 123. All rights reserved.</span><span>Certified Career & Life Coach · Certified Résumé Writer · Interview Coach</span></div>
    </div></footer>
    <SlideIn /><StickyCta />
  </>)
}
