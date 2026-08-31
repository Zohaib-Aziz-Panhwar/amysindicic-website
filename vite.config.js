import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://<user>.github.io/amysindicic-website/ on GitHub Pages.
// Set VITE_BASE=/ when deploying to a custom domain or another host.
const base = process.env.VITE_BASE || '/amysindicic-website/'

export default defineConfig({
  base,
  plugins: [react()],
  server: { port: 5173, open: true },
})
