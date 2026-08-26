import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Arrow, Play, CountUp, useVideo } from './ui'
import { TRANSLATIONS, FLIP_PAIRS, VIDEO_ID } from '../data'

function Constellation() {
  const ref = useRef(null); const reduce = useReducedMotion()
  useEffect(() => {
    const c = ref.current; if (!c || reduce) return
    const ctx = c.getContext('2d'); let W, H, pts = [], mx = -1e4, my = -1e4, raf, vis = true
    const size = () => { const r = c.getBoundingClientRect(); c.width = r.width * devicePixelRatio; c.height = r.height * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); W = r.width; H = r.height
      const n = Math.round(Math.min(110, W * H / 16000)); pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25, r: Math.random() * 1.6 + .6, o: Math.random() < .2 })) }
    size(); addEventListener('resize', size)
    const par = c.parentNode; const mm = (e) => { const r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top }; const ml = () => { mx = my = -1e4 }
    par.addEventListener('mousemove', mm); par.addEventListener('mouseleave', ml)
    const draw = () => { if (!vis) { raf = null; return } ctx.clearRect(0, 0, W, H)
      for (const p of pts) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy); if (d < 140) { p.x += dx / d * .6; p.y += dy / d * .6 } }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) { const a = pts[i], b = pts[j], dd = (a.x - b.x) ** 2 + (a.y - b.y) ** 2; if (dd < 16900) { const al = (1 - Math.sqrt(dd) / 130) * .35; ctx.strokeStyle = (a.o || b.o) ? `rgba(240,134,28,${al})` : `rgba(140,170,230,${al * .8})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke() } }
      for (const q of pts) { ctx.fillStyle = q.o ? 'rgba(240,134,28,.95)' : 'rgba(190,210,255,.8)'; ctx.beginPath(); ctx.arc(q.x, q.y, q.r, 0, 6.283); ctx.fill(); if (q.o) { ctx.fillStyle = 'rgba(240,134,28,.15)'; ctx.beginPath(); ctx.arc(q.x, q.y, q.r * 4, 0, 6.283); ctx.fill() } }
      raf = requestAnimationFrame(draw) }
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !raf) draw() }); io.observe(c); draw()
    return () => { cancelAnimationFrame(raf); io.disconnect(); removeEventListener('resize', size); par.removeEventListener('mousemove', mm); par.removeEventListener('mouseleave', ml) }
  }, [reduce])
  return <canvas className="hero__net" ref={ref} aria-hidden="true" />
}

function Flip() {
  const [k, setK] = useState(0); const reduce = useReducedMotion()
  useEffect(() => { if (reduce) return; const t = setInterval(() => setK((k) => (k + 1) % FLIP_PAIRS.length), 3200); return () => clearInterval(t) }, [reduce])
  const W = ({ txt, em }) => { const T = em ? motion.em : motion.span; return <T key={txt} className={'flip ' + (em ? 'flip--em' : '')} style={{ display: 'inline-block' }} initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-110%', opacity: 0 }} transition={{ duration: .55, ease: [0.2, 0.7, 0.2, 1] }}>{txt}</T> }
  return <h1 className="hero__h1">From <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}><W txt={FLIP_PAIRS[k][0]} /></span><br />to <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom' }}><W txt={FLIP_PAIRS[k][1]} em /></span></h1>
}

function Translator() {
  const [i, setI] = useState(0); const [from, setFrom] = useState(''); const [to, setTo] = useState(''); const [strike, setStrike] = useState(false); const [prog, setProg] = useState(0); const reduce = useReducedMotion()
  useEffect(() => {
    const e = TRANSLATIONS[i]; let alive = true; const timers = []
    if (reduce) { setFrom(e[0]); setTo(e[1]); return }
    setFrom(''); setTo(''); setStrike(false); setProg(0)
    const type = (str, speed, set, cb) => { let n = 0; const tick = () => { if (!alive) return; set(str.slice(0, ++n)); if (n < str.length) timers.push(setTimeout(tick, speed)); else cb?.() }; tick() }
    type(e[0], 18, setFrom, () => timers.push(setTimeout(() => { setStrike(true); type(e[1], 26, setTo, () => { const t0 = Date.now(); const pr = () => { if (!alive) return; const p = Math.min((Date.now() - t0) / 2600, 1); setProg(p * 100); if (p < 1) requestAnimationFrame(pr); else setI((i) => (i + 1) % TRANSLATIONS.length) }; pr() }) }, 500)))
    return () => { alive = false; timers.forEach(clearTimeout) }
  }, [i, reduce])
  return (
    <div className="translator">
      <div className="translator__bar"><span className="dot" /><span className="dot" /><span className="dot" /><b>The Amy translation · live</b></div>
      <div className="translator__row"><small>Your federal résumé says</small><p className={'t-from' + (strike ? ' strike' : '')}>{from}</p></div>
      <div className="translator__arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M6 13l6 6 6-6" /></svg></div>
      <div className="translator__row translator__row--to"><small>A hiring committee reads</small><p className="t-to">{to}</p></div>
      <div className="translator__foot"><span className="tag">{TRANSLATIONS[i][2]}</span><span className="progress"><i style={{ width: prog + '%' }} /></span></div>
    </div>
  )
}

export default function Hero() {
  const openVideo = useVideo(); const reduce = useReducedMotion(); const heroRef = useRef(null)
  const mx = useMotionValue(0), my = useMotionValue(0); const sx = useSpring(mx, { stiffness: 80, damping: 20 }), sy = useSpring(my, { stiffness: 80, damping: 20 })
  const P = (d) => ({ x: useTransform(sx, (v) => -v * d), y: useTransform(sy, (v) => -v * d) })
  const p18 = P(18), p40 = P(40), p30 = P(30), p55 = P(55), p12 = P(12)
  const [spot, setSpot] = useState({ x: '50%', y: '40%' })
  const onMove = (e) => { const r = heroRef.current.getBoundingClientRect(); mx.set((e.clientX - r.left) / r.width - .5); my.set((e.clientY - r.top) / r.height - .5); setSpot({ x: e.clientX - r.left + 'px', y: e.clientY - r.top + 'px' }) }
  const onLeave = () => { mx.set(0); my.set(0) }
  const stag = { hidden: {}, show: { transition: { staggerChildren: .1 } } }; const item = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: .8, ease: [0.2, 0.7, 0.2, 1] } } }
  return (
    <section className="hero hero--v3 dark" ref={heroRef} onMouseMove={reduce ? undefined : onMove} onMouseLeave={onLeave}>
      <Constellation />
      <div className="hero__glow" aria-hidden="true" /><div className="hero__spot" aria-hidden="true" style={{ '--sx': spot.x, '--sy': spot.y }} />
      <div className="wrap">
        <motion.div className="stagger" variants={stag} initial="hidden" animate="show">
          <motion.span variants={item} className="eyebrow">Career strategist · Government & military → private sector</motion.span>
          <motion.div variants={item}><Flip /></motion.div>
          <motion.p variants={item} className="lede">Translate your public service into private-sector leadership. Position your value. Land the role you've already earned.</motion.p>
          <motion.div variants={item} className="hero__cta">
            <Link className="btn btn--primary btn--glow" to="/contact">Book a discovery call <Arrow /></Link>
            <a className="btn btn--play" href={`https://www.youtube.com/watch?v=${VIDEO_ID}`} onClick={(e) => { e.preventDefault(); openVideo() }}><i><Play /></i>Watch Amy in action</a>
          </motion.div>
          <motion.div variants={item} className="trust"><span className="trust__stars">★★★★★</span><span><b>5.0</b> from client reviews</span><i /><span>Clients in the U.S., Europe, Asia & Latin America</span></motion.div>
          <motion.div variants={item} className="hero__proof">
            <div><strong><CountUp to={30} suffix="+" /></strong><span>years teaching professionals to communicate with precision</span></div>
            <div><strong><CountUp to={4} /></strong><span>continents of senior clients served</span></div>
            <div><strong><CountUp to={3} /></strong><span>professional certifications</span></div>
          </motion.div>
        </motion.div>
        <motion.div className="hero__stage" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9, delay: .3 }}>
          <motion.div style={p18}><Translator /></motion.div>
          <motion.div className="chip chip--a" style={p40}><b>GS-15 → VP</b><span>Typical move</span></motion.div>
          <motion.div className="chip chip--b" style={p30}><b>ECQs · TQs</b><span>SES packages</span></motion.div>
          <motion.img className="butterfly" src="assets/brand/butterfly-badge.png" alt="" style={p55} />
          <motion.div className="hero__card" style={p12}><img src="assets/img/amy-portrait.jpg" alt="Amy Sindicic" /><div><b>Amy Sindicic</b><span>Career strategist · Executive résumé writer · Interview advisor</span></div></motion.div>
        </motion.div>
      </div>
      <a className="scroll-cue" href="#why" aria-label="Scroll"><span /></a>
    </section>
  )
}
