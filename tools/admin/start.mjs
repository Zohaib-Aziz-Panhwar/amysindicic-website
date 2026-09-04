/**
 * `npm run admin` -- starts the site's dev server and the editor together, so
 * the preview pane beside the form is the real site, not a mock-up.
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../..')

const SITE_PORT = Number(process.env.SITE_PORT) || 5173
const ADMIN_PORT = Number(process.env.ADMIN_PORT) || 5174

// Vite is the only child process. The editor API runs in this process, which
// also keeps it clear of Windows' argument quoting -- the project path has a
// space in it, and a shell spawn splits on that.
const vite = spawn('npx', ['vite', '--port', String(SITE_PORT), '--strictPort'], {
  cwd: root,
  stdio: ['ignore', 'inherit', 'inherit'],
  shell: process.platform === 'win32',
})

let shuttingDown = false
function shutdown(code = 0) {
  if (shuttingDown) return
  shuttingDown = true
  vite.kill()
  process.exit(code)
}
vite.on('exit', (code) => {
  if (shuttingDown) return
  console.error(`\nThe site's dev server exited (${code}). Stopping.`)
  shutdown(code ?? 1)
})
process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

process.env.ADMIN_PORT = String(ADMIN_PORT)
await import('./server.mjs')

console.log(`
  Site editor   http://localhost:${ADMIN_PORT}
  The site      http://localhost:${SITE_PORT}

  Edit on the left, watch the real site on the right. Save writes to
  src/data/*.json and public/images/. Deploy with:  bash scripts/deploy.sh "message"
  Press Ctrl+C to stop.
`)
