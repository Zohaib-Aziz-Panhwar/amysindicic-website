import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHero, Reveal, ClosingBand } from '../components/Common.jsx'
import { CALENDLY_URL } from '../data/content.js'
import { asset } from '../lib/asset.js'

/* The application form. Amy wanted people to tell her about themselves before
   they reach the calendar, so this collects her qualifying questions, then
   hands everything to Calendly, pre-filled: name and email go into Calendly's
   own fields and the rest is written into the booking's question as a summary.
   When Calendly confirms the booking we send people to the /booked page.
   This mirrors the apply form on transformations123 and uses the same calendar. */

const HEAR = [
  'LinkedIn', 'Instagram', 'Upwork', 'Referral from a colleague or friend',
  'Google / search engine', 'Previous client or student', 'Other',
]
const DESCRIBES = [
  'Federal Government Leader', 'SES Candidate / Senior Federal Leader',
  'Military Leader / Veteran', 'Corporate Executive / Senior Leader',
  'Healthcare Leader', 'IT / Technology Leader', 'Other Senior Professional',
]
const COMPENSATION = [
  'Under $100K', '$100K–$125K', '$125K–$150K', '$150K–$175K',
  '$175K–$200K', '$200K–$250K', '$250K+', 'Not sure yet',
]
const TIMELINE = [
  'Immediately', 'Within 30 days', 'Within 1–3 months', 'Within 3–6 months',
  'Within 6–12 months', 'More than 12 months', 'I am exploring my options',
]

const EMPTY = {
  firstName: '', lastName: '', email: '', phone: '',
  hear: '', describes: '', challenge: '', opportunity: '',
  compensation: '', timeline: '', goals: '', linkedin: '', invest: '',
}

export default function Apply() {
  const navigate = useNavigate()
  const [started, setStarted] = useState(false)
  const [v, setV] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  function begin() {
    setStarted(true)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  const update = (e) => {
    const { name, value } = e.target
    setV((s) => ({ ...s, [name]: value }))
    setErrors((p) => (p[name] ? { ...p, [name]: undefined } : p))
  }

  /* Load the Calendly widget once, and listen for the "booked" message so we
     can show the confirmation page afterwards. */
  useEffect(() => {
    if (!document.getElementById('calendly-css')) {
      const link = document.createElement('link')
      link.id = 'calendly-css'; link.rel = 'stylesheet'
      link.href = 'https://assets.calendly.com/assets/external/widget.css'
      document.head.appendChild(link)
    }
    if (!document.getElementById('calendly-js')) {
      const s = document.createElement('script')
      s.id = 'calendly-js'; s.async = true
      s.src = 'https://assets.calendly.com/assets/external/widget.js'
      document.body.appendChild(s)
    }
    const onMessage = (e) => {
      if (e.data && e.data.event === 'calendly.event_scheduled') navigate('/booked')
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [navigate])

  function validate() {
    const e = {}
    const required = ['firstName', 'lastName', 'email', 'phone', 'hear',
      'describes', 'challenge', 'opportunity', 'compensation', 'timeline',
      'goals', 'invest']
    required.forEach((k) => { if (!v[k].trim()) e[k] = 'Required.' })
    if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter a valid email.'
    if (v.invest.trim() && v.invest.trim().toUpperCase() !== 'YES') e.invest = 'Please type YES to confirm.'
    return e
  }

  function summary() {
    return [
      ['How did you hear about me', v.hear],
      ['Which best describes you', v.describes],
      ['Biggest career challenge / frustration', v.challenge],
      ['Opportunity / direction considering', v.opportunity],
      ['Target compensation range', v.compensation],
      ['Timeline for next move', v.timeline],
      ['Goals for next career move', v.goals],
      ['LinkedIn profile', v.linkedin || '(not provided)'],
      ['Phone', v.phone],
      ['Ready to invest ($499–$1,999)', v.invest.trim().toUpperCase()],
    ].map(([k, val]) => `${k}: ${val}`).join('\n')
  }

  function onSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      const first = document.querySelector('.field--error input, .field--error select, .field--error textarea')
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' })
      if (first) first.focus({ preventScroll: true })
      return
    }
    const prefill = {
      name: `${v.firstName.trim()} ${v.lastName.trim()}`.trim(),
      email: v.email.trim(),
      customAnswers: { a1: summary() },
    }
    if (window.Calendly) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL, prefill })
    } else {
      const u = new URL(CALENDLY_URL)
      u.searchParams.set('name', prefill.name)
      u.searchParams.set('email', prefill.email)
      u.searchParams.set('a1', prefill.customAnswers.a1)
      window.open(u.toString(), '_blank', 'noopener')
    }
  }

  const fld = (name) => `field ${errors[name] ? 'field--error' : ''}`

  /* Step 1: Amy's artwork. People meet her and see the price before the form. */
  if (!started) {
    return (
      <section className="apply-intro">
        <div className="apply-intro-inner">
          <button type="button" className="apply-panel" onClick={begin} aria-label="Start your application">
            <img
              src={asset('/images/apply-hero.jpg')}
              alt="Apply to Work With Me — Amy Sindicic, Career Strategy, Leadership and Executive Coaching. Due to a full schedule, I'm only accepting a limited number of new clients at this time. Use the link below to schedule an evaluation call and apply."
            />
          </button>
          <button type="button" className="btn apply-start" onClick={begin}>
            Start Your Application &rarr;
          </button>
          <p className="apply-note">You&rsquo;ll pick a time after you apply.</p>
        </div>
      </section>
    )
  }

  /* Step 2: the application form, which hands off to Calendly. */
  return (
    <>
      <PageHero
        title="Apply to Work With Me"
        text="Due to a full schedule, I'm accepting a limited number of new clients. Tell me a little about yourself and you'll choose a time on the next step."
      />

      <section className="section">
        <div className="wrap apply-wrap">
          <Reveal>
            <form className="form" onSubmit={onSubmit} noValidate>
              <div className="form-row">
                <div className={fld('firstName')}>
                  <label htmlFor="firstName">First name *</label>
                  <input id="firstName" name="firstName" value={v.firstName} onChange={update} />
                  {errors.firstName && <p className="field__err">{errors.firstName}</p>}
                </div>
                <div className={fld('lastName')}>
                  <label htmlFor="lastName">Last name *</label>
                  <input id="lastName" name="lastName" value={v.lastName} onChange={update} />
                  {errors.lastName && <p className="field__err">{errors.lastName}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className={fld('email')}>
                  <label htmlFor="email">Email *</label>
                  <input id="email" name="email" type="email" value={v.email} onChange={update} />
                  {errors.email && <p className="field__err">{errors.email}</p>}
                </div>
                <div className={fld('phone')}>
                  <label htmlFor="phone">Phone number *</label>
                  <input id="phone" name="phone" type="tel" value={v.phone} onChange={update} />
                  {errors.phone && <p className="field__err">{errors.phone}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className={fld('hear')}>
                  <label htmlFor="hear">How did you hear about me? *</label>
                  <select id="hear" name="hear" value={v.hear} onChange={update}>
                    <option value="">Please choose…</option>
                    {HEAR.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {errors.hear && <p className="field__err">{errors.hear}</p>}
                </div>
                <div className={fld('describes')}>
                  <label htmlFor="describes">Which best describes you? *</label>
                  <select id="describes" name="describes" value={v.describes} onChange={update}>
                    <option value="">Please choose…</option>
                    {DESCRIBES.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {errors.describes && <p className="field__err">{errors.describes}</p>}
                </div>
              </div>

              <div className={fld('challenge')}>
                <label htmlFor="challenge">What is the biggest career challenge or frustration you are facing right now? *</label>
                <textarea id="challenge" name="challenge" value={v.challenge} onChange={update}
                  placeholder="For example: not getting interviews, unclear direction, transition to private sector, career gap, etc." />
                {errors.challenge && <p className="field__err">{errors.challenge}</p>}
              </div>

              <div className={fld('opportunity')}>
                <label htmlFor="opportunity">What type of opportunity or career direction are you considering? *</label>
                <textarea id="opportunity" name="opportunity" value={v.opportunity} onChange={update}
                  placeholder="For example: industry, function, leadership level, target roles, etc." />
                {errors.opportunity && <p className="field__err">{errors.opportunity}</p>}
              </div>

              <div className="form-row">
                <div className={fld('compensation')}>
                  <label htmlFor="compensation">What is your target compensation range? *</label>
                  <select id="compensation" name="compensation" value={v.compensation} onChange={update}>
                    <option value="">Please choose…</option>
                    {COMPENSATION.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {errors.compensation && <p className="field__err">{errors.compensation}</p>}
                </div>
                <div className={fld('timeline')}>
                  <label htmlFor="timeline">What is your timeline for your next career move? *</label>
                  <select id="timeline" name="timeline" value={v.timeline} onChange={update}>
                    <option value="">Please choose…</option>
                    {TIMELINE.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                  {errors.timeline && <p className="field__err">{errors.timeline}</p>}
                </div>
              </div>

              <div className={fld('goals')}>
                <label htmlFor="goals">What are your goals for your next career move? *</label>
                <textarea id="goals" name="goals" value={v.goals} onChange={update}
                  placeholder="For example: position, industry, leadership level, long-term goals, anything you think will help us." />
                {errors.goals && <p className="field__err">{errors.goals}</p>}
              </div>

              <div className="field">
                <label htmlFor="linkedin">Please provide your LinkedIn profile URL so we may review before our call.</label>
                <input id="linkedin" name="linkedin" type="url" value={v.linkedin} onChange={update}
                  placeholder="https://www.linkedin.com/in/your-name" />
              </div>

              <div className={fld('invest')}>
                <label htmlFor="invest">Packages range from $499 to $1,999. Type &ldquo;YES&rdquo; to confirm you are ready to invest. *</label>
                <input id="invest" name="invest" value={v.invest} onChange={update} placeholder="YES" />
                {errors.invest && <p className="field__err">{errors.invest}</p>}
              </div>

              <div>
                <button type="submit" className="btn">Choose a time &rarr;</button>
                <p className="apply-foot">You&rsquo;ll pick a time on the next step. Your answers go straight to Amy.</p>
              </div>
            </form>
          </Reveal>
        </div>
      </section>
      <ClosingBand />
    </>
  )
}
