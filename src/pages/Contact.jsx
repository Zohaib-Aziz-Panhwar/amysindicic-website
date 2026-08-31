import { useState } from 'react'
import { PageHero, Reveal, Placeholder, ClosingBand } from '../components/Common.jsx'
import { services, audiences } from '../data/content.js'

const EMPTY = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  currentRole: '',
  interest: '',
  background: '',
  message: '',
}

function validate(values) {
  const errors = {}
  if (!values.firstName.trim()) errors.firstName = 'Please enter your first name.'
  if (!values.lastName.trim()) errors.lastName = 'Please enter your last name.'
  if (!values.email.trim()) errors.email = 'Please enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }
  if (!values.interest) errors.interest = 'Please choose what you would like to discuss.'
  if (!values.message.trim()) errors.message = 'Please tell Amy a little about your situation.'
  else if (values.message.trim().length < 20) errors.message = 'A sentence or two more would help.'
  return errors
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent

  const update = (e) => {
    const { name, value } = e.target
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      const first = document.querySelector('.field--error input, .field--error select, .field--error textarea')
      if (first) first.focus()
      return
    }
    setStatus('sending')
    // TODO: replace with the real endpoint (Formspree, HubSpot, or a serverless
    // function) — POST `values` and handle the response here.
    await new Promise((r) => setTimeout(r, 700))
    setStatus('sent')
  }

  const field = (name) => `field ${errors[name] ? 'field--error' : ''}`

  return (
    <>
      <PageHero title="Book a Discovery Call" />

      <section className="section">
        <div className="wrap grid-2" style={{ alignItems: 'start', gap: 60 }}>
          <Reveal>
            {status === 'sent' ? (
              <div className="form-note">
                <h3 style={{ color: '#2f5c31', marginBottom: 10 }}>Thank you — your request is in.</h3>
                <p style={{ margin: 0 }}>
                  {/* TODO (client): confirm the response-time wording used here. */}
                  Amy will be in touch about your discovery call.
                </p>
                <button
                  type="button"
                  className="btn btn--dark"
                  style={{ marginTop: 20 }}
                  onClick={() => { setValues(EMPTY); setStatus('idle') }}
                >
                  Send another request
                </button>
              </div>
            ) : (
              <form className="form" onSubmit={onSubmit} noValidate>
                <div className="form-row">
                  <div className={field('firstName')}>
                    <label htmlFor="firstName">First name *</label>
                    <input id="firstName" name="firstName" value={values.firstName} onChange={update} />
                    {errors.firstName && <p className="field__err">{errors.firstName}</p>}
                  </div>
                  <div className={field('lastName')}>
                    <label htmlFor="lastName">Last name *</label>
                    <input id="lastName" name="lastName" value={values.lastName} onChange={update} />
                    {errors.lastName && <p className="field__err">{errors.lastName}</p>}
                  </div>
                </div>

                <div className="form-row">
                  <div className={field('email')}>
                    <label htmlFor="email">Email *</label>
                    <input id="email" name="email" type="email" value={values.email} onChange={update} />
                    {errors.email && <p className="field__err">{errors.email}</p>}
                  </div>
                  <div className="field">
                    <label htmlFor="phone">Phone</label>
                    <input id="phone" name="phone" type="tel" value={values.phone} onChange={update} />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="currentRole">Current role &amp; organisation</label>
                  <input id="currentRole" name="currentRole" value={values.currentRole} onChange={update} />
                </div>

                <div className="form-row">
                  <div className={field('interest')}>
                    <label htmlFor="interest">What would you like to discuss? *</label>
                    <select id="interest" name="interest" value={values.interest} onChange={update}>
                      <option value="">Please choose…</option>
                      {services.map((s) => (
                        <option key={s.slug} value={s.title}>{s.title}</option>
                      ))}
                      <option value="Not sure yet">Not sure yet — let’s talk</option>
                    </select>
                    {errors.interest && <p className="field__err">{errors.interest}</p>}
                  </div>
                  <div className="field">
                    <label htmlFor="background">Your background</label>
                    <select id="background" name="background" value={values.background} onChange={update}>
                      <option value="">Please choose…</option>
                      {audiences.map((s) => (
                        <option key={s.slug} value={s.title}>{s.title}</option>
                      ))}
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className={field('message')}>
                  <label htmlFor="message">Where are you right now? *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={values.message}
                    onChange={update}
                    placeholder="A few sentences on your situation and what you are weighing."
                  />
                  {errors.message && <p className="field__err">{errors.message}</p>}
                </div>

                <div>
                  <button type="submit" className="btn" disabled={status === 'sending'}>
                    {status === 'sending' ? 'Sending…' : 'Request my discovery call'}
                  </button>
                </div>
              </form>
            )}
          </Reveal>

          <Reveal delay={120}>
            <Placeholder label="Contact details & “what to expect” copy to be supplied by client">
              <p>
                The design shows a “Book a Discovery Call” button but no contact page. Add Amy’s
                email, phone, and location to <code>site</code> in <code>src/data/content.js</code>,
                along with any copy describing what the call involves.
              </p>
            </Placeholder>
          </Reveal>
        </div>
      </section>
      <ClosingBand />
    </>
  )
}
