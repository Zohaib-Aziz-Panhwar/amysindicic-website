/**
 * Local editor API. Reads and writes the JSON the site renders from, and saves
 * uploaded photos into public/images/. Dependency-free and bound to 127.0.0.1
 * -- it is a local editing tool, never something to expose.
 *
 * Everything except the login endpoints requires a session; see auth.mjs.
 */
import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  hasCredentials, setCredentials, login, logout, isValidSession,
  COOKIE, readCookie, sessionCookie, clearedCookie,
} from './auth.mjs'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../..')
const DATA = path.join(root, 'src/data')
const PUBLIC_IMAGES = path.join(root, 'public/images')
const UI = path.join(here, 'ui')
const PORT = Number(process.env.ADMIN_PORT) || 5174

const FILES = { content: 'content.json', posts: 'posts.json' }

// Uploads may only land in these folders, under a name we sanitise ourselves.
const UPLOAD_DIRS = new Set(['blog', 'testimonials', ''])

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
}

const json = (res, code, body, headers = {}) => {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', ...headers })
  res.end(JSON.stringify(body))
}

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (c) => {
      raw += c
      // A portrait or cover photo as base64 is well under this.
      if (raw.length > 24e6) { reject(new Error('Payload too large')); req.destroy() }
    })
    req.on('end', () => { try { resolve(JSON.parse(raw || '{}')) } catch (e) { reject(e) } })
    req.on('error', reject)
  })

/** Lower-case, hyphenated, extension-checked -- never a caller-supplied path. */
function safeName(name, ext) {
  const base = path.basename(String(name), path.extname(String(name)))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return `${base || 'image'}${ext}`
}

async function writeJson(file, value) {
  const target = path.join(DATA, file)
  // Written via a temp file so an interrupted save cannot truncate the real one.
  const tmp = `${target}.tmp`
  await fs.writeFile(tmp, JSON.stringify(value, null, 2) + '\n')
  await fs.rename(tmp, target)
}

async function serveFile(res, name) {
  const file = path.join(UI, name)
  if (!file.startsWith(UI)) return json(res, 403, { error: 'Forbidden' })
  try {
    const body = await fs.readFile(file)
    res.writeHead(200, {
      'content-type': MIME[path.extname(file)] || 'application/octet-stream',
      'cache-control': 'no-store',
    })
    res.end(body)
  } catch {
    json(res, 404, { error: 'Not found' })
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1')
  const p = url.pathname
  const token = readCookie(req.headers.cookie, COOKIE)
  const signedIn = isValidSession(token)

  try {
    /* ---------------------------------------------------------- sign in -- */

    if (p === '/api/session' && req.method === 'GET') {
      return json(res, 200, { signedIn, needsSetup: !(await hasCredentials()) })
    }

    if (p === '/api/setup' && req.method === 'POST') {
      // Only ever available before a login exists, so it cannot be used to
      // overwrite one.
      if (await hasCredentials()) return json(res, 409, { error: 'A login already exists' })
      const { username, password } = await readBody(req)
      const name = await setCredentials(username, password)
      const fresh = await login(name, password)
      return json(res, 200, { ok: true }, { 'set-cookie': sessionCookie(fresh) })
    }

    if (p === '/api/login' && req.method === 'POST') {
      const { username, password } = await readBody(req)
      const fresh = await login(username, password)
      return json(res, 200, { ok: true }, { 'set-cookie': sessionCookie(fresh) })
    }

    if (p === '/api/logout' && req.method === 'POST') {
      logout(token)
      return json(res, 200, { ok: true }, { 'set-cookie': clearedCookie })
    }

    // The sign-in page and what it needs to look like itself. The stylesheet is
    // shared with the editor, and holds nothing worth gating.
    const PUBLIC_FILES = { '/login': 'login.html', '/login.js': 'login.js', '/admin.css': 'admin.css' }
    if (PUBLIC_FILES[p]) return serveFile(res, PUBLIC_FILES[p])

    /* --------------------------------------------------------- the gate -- */

    if (!signedIn) {
      if (p.startsWith('/api/')) return json(res, 401, { error: 'Please sign in again' })
      res.writeHead(302, { location: '/login' })
      return res.end()
    }

    /* ------------------------------------------------------------- data -- */

    if (p === '/api/data' && req.method === 'GET') {
      const [content, posts] = await Promise.all([
        fs.readFile(path.join(DATA, FILES.content), 'utf8'),
        fs.readFile(path.join(DATA, FILES.posts), 'utf8'),
      ])
      return json(res, 200, { content: JSON.parse(content), posts: JSON.parse(posts) })
    }

    if (p === '/api/data' && req.method === 'PUT') {
      const body = await readBody(req)
      if (!body.content || !Array.isArray(body.posts)) {
        return json(res, 400, { error: 'Expected { content, posts }' })
      }
      await writeJson(FILES.content, body.content)
      await writeJson(FILES.posts, body.posts)
      return json(res, 200, { ok: true, savedAt: new Date().toISOString() })
    }

    if (p === '/api/upload' && req.method === 'POST') {
      const { name, dir = '', dataUrl } = await readBody(req)
      if (!UPLOAD_DIRS.has(dir)) return json(res, 400, { error: `Unknown folder "${dir}"` })
      const m = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl || '')
      if (!m) return json(res, 400, { error: 'Expected a JPEG, PNG or WebP data URL' })
      const ext = { jpeg: '.jpg', png: '.png', webp: '.webp' }[m[1]]
      const file = safeName(name, ext)
      const folder = path.join(PUBLIC_IMAGES, dir)
      await fs.mkdir(folder, { recursive: true })
      await fs.writeFile(path.join(folder, file), Buffer.from(m[2], 'base64'))
      return json(res, 200, { path: `/images/${dir ? dir + '/' : ''}${file}` })
    }

    if (p.startsWith('/api/')) return json(res, 404, { error: 'Unknown endpoint' })

    return serveFile(res, p === '/' ? 'index.html' : path.normalize(p).replace(/^[\\/]+/, ''))
  } catch (err) {
    return json(res, 400, { error: err.message })
  }
})

server.listen(PORT, '127.0.0.1', async () => {
  const first = !(await hasCredentials())
  console.log(`  Site editor   http://localhost:${PORT}${first ? '   (first run: choose a login)' : ''}`)
})
