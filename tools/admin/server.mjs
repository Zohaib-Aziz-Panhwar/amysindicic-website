/**
 * Local admin API. Reads and writes the JSON the site renders from, and saves
 * uploaded photos into public/images/. Deliberately dependency-free and bound
 * to 127.0.0.1 -- it is a local editing tool, never something to expose.
 */
import http from 'node:http'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../..')
const DATA = path.join(root, 'src/data')
const PUBLIC_IMAGES = path.join(root, 'public/images')
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

const json = (res, code, body) => {
  res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' })
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

async function serveStatic(res, urlPath) {
  const rel = urlPath === '/' ? '/index.html' : urlPath
  const file = path.join(here, 'ui', path.normalize(rel).replace(/^[\/]+/, ''))
  if (!file.startsWith(path.join(here, 'ui'))) return json(res, 403, { error: 'Forbidden' })
  try {
    const body = await fs.readFile(file)
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' })
    res.end(body)
  } catch {
    json(res, 404, { error: 'Not found' })
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1')
  const p = url.pathname

  try {
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
    return serveStatic(res, p)
  } catch (err) {
    return json(res, 500, { error: err.message })
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`  Admin   http://localhost:${PORT}`)
})
