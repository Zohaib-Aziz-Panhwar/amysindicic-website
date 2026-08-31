// Line-art icon set. All icons inherit color via `currentColor`.
const base = (size) => ({
  width: size,
  height: size,
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
})

export function IconCoaching({ size = 44 }) {
  return (
    <svg {...base(size)}>
      <circle cx="24" cy="24" r="21" strokeWidth="1" />
      <circle cx="24" cy="19" r="5.5" />
      <path d="M14 34c1.6-5.2 5.4-7.8 10-7.8S32.4 28.8 34 34" />
    </svg>
  )
}

export function IconFeather({ size = 44 }) {
  return (
    <svg {...base(size)}>
      <circle cx="24" cy="24" r="21" strokeWidth="1" />
      <path d="M33 15c1.5 6.5-1.2 12.6-6.4 16-2.6 1.7-5.6 2.2-8.6 1.6 1-6.9 4.6-12.6 10-15.6 1.6-.9 3.3-1.6 5-2z" />
      <path d="M15 33l6.5-6.5M24 22.5l-3.5 1M27.5 19l-3.5 1" />
    </svg>
  )
}

export function IconCompassPath({ size = 44 }) {
  return (
    <svg {...base(size)}>
      <circle cx="24" cy="24" r="21" strokeWidth="1" />
      <path d="M24 34V14" />
      <path d="M24 14l-6 4M24 14l6 4" />
      <path d="M16 26h16" />
    </svg>
  )
}

export function IconSearchTarget({ size = 44 }) {
  return (
    <svg {...base(size)}>
      <circle cx="24" cy="24" r="21" strokeWidth="1" />
      <circle cx="22" cy="22" r="7" />
      <path d="M27.5 27.5L33 33" />
    </svg>
  )
}

export function IconCapitol({ size = 26 }) {
  return (
    <svg {...base(size)}>
      <path d="M24 6v5M18 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M12 20h24v3H12zM14 23v13M20 23v13M28 23v13M34 23v13M10 36h28v4H10z" />
    </svg>
  )
}

export function IconStars({ size = 26 }) {
  return (
    <svg {...base(size)}>
      <path d="M12 16l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9L8.4 27l.7-4-2.9-2.8 4-.6z" />
      <path d="M24 14l2.1 4.3 4.7.7-3.4 3.3.8 4.7-4.2-2.2-4.2 2.2.8-4.7-3.4-3.3 4.7-.7z" />
      <path d="M36 16l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4-2.9-2.8 4-.6z" />
    </svg>
  )
}

export function IconRank({ size = 26 }) {
  return (
    <svg {...base(size)}>
      <path d="M12 14l12 8 12-8M12 22l12 8 12-8M12 30l12 8 12-8" />
    </svg>
  )
}

export function IconBriefcase({ size = 26 }) {
  return (
    <svg {...base(size)}>
      <rect x="8" y="16" width="32" height="22" rx="2" />
      <path d="M18 16v-3a3 3 0 013-3h6a3 3 0 013 3v3M8 25h32" />
    </svg>
  )
}

export function IconClarity({ size = 30 }) {
  return (
    <svg {...base(size)}>
      <circle cx="21" cy="21" r="10" />
      <path d="M28.5 28.5L38 38" />
    </svg>
  )
}

export function IconPositioning({ size = 30 }) {
  return (
    <svg {...base(size)}>
      <circle cx="24" cy="24" r="14" />
      <circle cx="24" cy="24" r="7.5" />
      <circle cx="24" cy="24" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconVisibility({ size = 30 }) {
  return (
    <svg {...base(size)}>
      <circle cx="24" cy="18" r="6" />
      <path d="M13 36c1.8-5.8 5.9-8.6 11-8.6S33.2 30.2 35 36" />
      <path d="M8 14c1.6-2 3.6-3.6 6-4.6M40 14c-1.6-2-3.6-3.6-6-4.6" />
    </svg>
  )
}

export function IconArrowRight({ size = 40 }) {
  return (
    <svg width={size} height="14" viewBox="0 0 40 14" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M0 7h36M30 2l6 5-6 5" />
    </svg>
  )
}

export function IconCheck({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 8.5l4 4 7-9" />
    </svg>
  )
}

/* ---- Small icons used in the "How we can work together" strip ---- */
const strip = { width: 30, height: 30, viewBox: '0 0 48 48', fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function IconGroup() {
  return (
    <svg {...strip}>
      <circle cx="24" cy="18" r="5" />
      <circle cx="11" cy="21" r="4" />
      <circle cx="37" cy="21" r="4" />
      <path d="M15 34c1.4-4 4.8-6 9-6s7.6 2 9 6M4 33c1-2.7 3.3-4.3 7-4.3M44 33c-1-2.7-3.3-4.3-7-4.3" />
    </svg>
  )
}

export function IconCompass() {
  return (
    <svg {...strip}>
      <circle cx="24" cy="24" r="16" />
      <path d="M30 18l-3.5 8.5L18 30l3.5-8.5z" />
    </svg>
  )
}

export function IconValue() {
  return (
    <svg {...strip}>
      <circle cx="21" cy="18" r="5.5" />
      <path d="M10 35c1.7-5 5.7-7.5 11-7.5 1.7 0 3.3.3 4.7.8" />
      <path d="M34 10l1.7 3.5 3.8.6-2.8 2.7.7 3.8-3.4-1.8-3.4 1.8.7-3.8-2.8-2.7 3.8-.6z" />
    </svg>
  )
}

export function IconResume() {
  return (
    <svg {...strip}>
      <path d="M13 8h16l7 7v25H13z" />
      <path d="M29 8v7h7M18 24h13M18 30h13M18 18h6" />
    </svg>
  )
}

export function IconLinkedIn() {
  return (
    <svg width="30" height="30" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round">
      <rect x="9" y="9" width="30" height="30" rx="3" />
      <path d="M17 21v11M17 16.5v.01" strokeLinecap="round" />
      <path d="M24 32V21M24 25c0-2.2 1.6-4 3.8-4s3.7 1.8 3.7 4v7" strokeLinecap="round" />
    </svg>
  )
}

export function IconNetwork() {
  return (
    <svg {...strip}>
      <circle cx="24" cy="12" r="4" />
      <circle cx="11" cy="34" r="4" />
      <circle cx="37" cy="34" r="4" />
      <path d="M21 15.5L14 30M27 15.5L34 30M15 34h18" />
    </svg>
  )
}

export function IconInterview() {
  return (
    <svg {...strip}>
      <rect x="9" y="10" width="30" height="22" rx="2" />
      <circle cx="24" cy="19" r="4" />
      <path d="M17 28c1.2-2.7 3.9-4.2 7-4.2s5.8 1.5 7 4.2M18 38h12" />
    </svg>
  )
}

export function IconBrand() {
  return (
    <svg {...strip}>
      <circle cx="24" cy="24" r="16" />
      <circle cx="24" cy="19" r="5" />
      <path d="M14 34c1.6-4.6 5.2-6.9 10-6.9s8.4 2.3 10 6.9" />
    </svg>
  )
}

export function IconGovToPrivate() {
  return (
    <svg {...strip}>
      <path d="M24 8l14 7H10z" />
      <path d="M14 15v18M22 15v18M26 15v18M34 15v18M9 33h30v5H9z" />
    </svg>
  )
}

export function IconMilToCorp() {
  return (
    <svg {...strip}>
      <path d="M13 12l11 7 11-7M13 21l11 7 11-7M13 30l11 7 11-7" />
    </svg>
  )
}
