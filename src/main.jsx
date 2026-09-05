import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/global.css'

const BASE = import.meta.env.BASE_URL

/**
 * The content is fetched rather than bundled, so the editor can change the
 * live site by writing two JSON files with no rebuild. It has to land before
 * anything imports src/data/content.js, which is why App is imported
 * dynamically below rather than at the top of this file.
 *
 * Cache-busted per load: the files sit next to hashed assets but their own
 * names never change, so a cached copy would hide a fresh edit.
 */
async function loadContent() {
  const bust = `?v=${Date.now()}`
  const [content, posts] = await Promise.all(
    ['content/content.json', 'content/posts.json'].map(async (file) => {
      const res = await fetch(`${BASE}${file}${bust}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(`${file} — ${res.status}`)
      return res.json()
    }),
  )
  globalThis.__SITE_CONTENT__ = { content, posts }
}

function showFailure(err) {
  document.getElementById('root').innerHTML = `
    <div style="font:16px/1.6 system-ui,sans-serif;max-width:34em;margin:18vh auto;padding:0 24px;color:#001125">
      <h1 style="font-size:1.25rem;margin:0 0 .6em">This page could not load</h1>
      <p style="margin:0 0 1em">The site's content did not come back from the server. A refresh usually fixes it.</p>
      <p style="margin:0;color:#5d6b7a;font-size:.85rem">${String(err.message || err)}</p>
    </div>`
}

loadContent()
  .then(async () => {
    const { default: App } = await import('./App.jsx')
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <BrowserRouter basename={BASE}>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    )
  })
  .catch(showFailure)
