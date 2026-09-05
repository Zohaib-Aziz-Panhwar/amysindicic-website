/**
 * Generates the hosted editor (deploy/admin) from the local one
 * (tools/admin/ui), so the two never drift apart.
 *
 * Only three things differ: where the API lives, that every write carries a
 * CSRF token, and that the preview pane is the same origin rather than a dev
 * server on another port.
 *
 * Run by scripts/deploy-admin.sh; also runnable on its own to inspect output.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(root, 'tools/admin/ui')
const OUT = path.join(root, 'deploy/admin')

const BANNER = `/* Generated from tools/admin/ui by scripts/build-admin.mjs — do not edit here. */\n`

/** Git checks these out with CRLF on Windows; compare and emit LF. */
const read = async (p) =>
  (await fs.readFile(p, 'utf8')).split('\r\n').join('\n')

/** Fails loudly rather than silently emitting a half-converted file. */
function swap(text, pairs, label) {
  for (const [from, to] of pairs) {
    if (!text.includes(from)) throw new Error(`${label}: expected to find ${JSON.stringify(from.slice(0, 60))}`)
    text = text.split(from).join(to)
  }
  return text
}

await fs.mkdir(OUT, { recursive: true })

// blocks.js and the stylesheet are environment-independent.
for (const f of ['blocks.js', 'admin.css']) {
  await fs.copyFile(path.join(SRC, f), path.join(OUT, f))
}

/* ------------------------------------------------------------- app.js ---- */

let app = await read(path.join(SRC, 'admin.js'))
app = swap(app, [
  [`from '/blocks.js'`, `from './blocks.js'`],

  // The site is served from the parent of /admin/, so paths resolve bare.
  [
    "const PREVIEW_ORIGIN = `http://localhost:${new URLSearchParams(location.search).get('site') || 5173}`",
    "const PREVIEW_ORIGIN = '..'  // the site sits one level above /admin/",
  ],

  // Every write carries the CSRF token the session handed out.
  [
    `/** Any call can come back 401 once the session lapses; send the user to sign in. */
async function api(path, options = {}) {
  const res = await fetch(path, { credentials: 'same-origin', ...options })
  if (res.status === 401) {
    location.replace('/login')
    throw new Error('Session expired')
  }
  return res
}`,
    `let csrf = ''

/** Any call can come back 401 once the session lapses; send the user to sign in. */
async function api(action, options = {}) {
  const res = await fetch(\`api.php?a=\${action}\`, {
    credentials: 'same-origin',
    ...options,
    headers: { ...(options.headers || {}), 'X-CSRF': csrf },
  })
  if (res.status === 401) {
    location.replace('login.php')
    throw new Error('Session expired')
  }
  return res
}`,
  ],

  [`const res = await api('/api/data')`, `const res = await api('data')`],
  [`const res = await api('/api/upload', {`, `const res = await api('upload', {`],
  [
    `    const res = await api('/api/data', {
      method: 'PUT',`,
    `    const res = await api('save', {
      method: 'POST',`,
  ],
  [
    `  await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' })
  location.replace('/login')`,
    `  await fetch('api.php?a=logout', { method: 'POST', credentials: 'same-origin' })
  location.replace('login.php')`,
  ],

  // The token comes from the session check, so fetch it before anything else.
  [
    `reloadPreview()
load().catch((err) => {`,
    `reloadPreview()
fetch('api.php?a=session', { credentials: 'same-origin' })
  .then((r) => r.json())
  .then((s) => {
    if (!s.signedIn) return location.replace('login.php')
    csrf = s.csrf
    return load()
  })
  .catch((err) => {`,
  ],
], 'app.js')

await fs.writeFile(path.join(OUT, 'app.js'), BANNER + app)

/* ----------------------------------------------------------- login.js ---- */

let login = await read(path.join(SRC, 'login.js'))
login = swap(login, [
  [`const res = await fetch('/api/session')`, `const res = await fetch('api.php?a=session', { credentials: 'same-origin' })`],
  [`if (s.signedIn) return location.replace('/')`, `if (s.signedIn) return location.replace('index.php')`],
  [
    `    const res = await fetch(needsSetup ? '/api/setup' : '/api/login', {`,
    `    const res = await fetch(needsSetup ? 'api.php?a=setup' : 'api.php?a=login', {`,
  ],
  [`      headers: { 'content-type': 'application/json' },`, `      credentials: 'same-origin',\n      headers: { 'content-type': 'application/json' },`],
  [`    location.replace('/')`, `    location.replace('index.php')`],
  [`Is \`npm run admin\` still running?`, `The server is not responding.`],
  [`at least 8 characters`, `at least 10 characters`],
], 'login.js')

await fs.writeFile(path.join(OUT, 'login.js'), BANNER + login)

/* ------------------------------------------------------------- html ------ */

const page = async (src, dest, pairs) => {
  let html = await read(path.join(SRC, src))
  html = swap(html, pairs, dest)
  await fs.writeFile(path.join(OUT, dest), html)
}

await page('index.html', 'index.php', [
  [`href="/admin.css"`, `href="admin.css"`],
  [`src="/admin.js"`, `src="app.js"`],
  [`<title>Amy Sindicic — Site Editor</title>`, `<title>Amy Sindicic — Site Editor</title>`],
])

await page('login.html', 'login.php', [
  [`href="/admin.css"`, `href="admin.css"`],
  [`src="/login.js"`, `src="login.js"`],
])

console.log('built deploy/admin:', (await fs.readdir(OUT)).sort().join(', '))
