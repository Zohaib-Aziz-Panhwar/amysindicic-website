import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves project sites from /<repo>/, so the base path must match
// whichever repository the build runs in. In CI that comes free from
// GITHUB_REPOSITORY; locally (and on a custom domain) it is just "/".
// VITE_BASE overrides both.
const repo = (process.env.GITHUB_REPOSITORY || '').split('/')[1]
const base = process.env.VITE_BASE || (repo ? `/${repo}/` : '/')

export default defineConfig({
  base,
  plugins: [react()],
  server: { port: 5173, open: true },
})
