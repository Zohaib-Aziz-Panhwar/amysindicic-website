import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Served at https://parix-ai.github.io/amy-site/ — set VITE_BASE=/ for a custom domain.
export default defineConfig({ plugins: [react()], base: process.env.VITE_BASE || '/amy-site/' })
